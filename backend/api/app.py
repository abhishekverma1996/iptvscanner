from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from api.macscanner import macscanner  # Import macscanner blueprint
import requests
import json
from datetime import datetime
from urllib.parse import urlparse
import re
import os
from io import BytesIO
from typing import Dict, Any, List, Optional, Tuple

app = Flask(__name__)
CORS(app)
CORS(app, origins="https://iptvscanner-frontend.vercel.app")
# Register macscanner blueprint
app.register_blueprint(macscanner, url_prefix='/macscanner')  # This will add the '/macscanner' prefix for the routes in macscanner

# Function to fetch the token
def get_token(session: requests.Session, base_url: str, timeout: int = 10) -> Optional[str]:
    url = f"{base_url}/portal.php?action=handshake&type=stb&token=&JsHttpRequest=1-xml"
    try:
        res = session.get(url, timeout=timeout, allow_redirects=False)
        data = json.loads(res.text)
        return data['js']['token']
    except (requests.RequestException, json.JSONDecodeError) as e:
        return None

# Function to fetch subscription info
def get_subscription(session: requests.Session, base_url: str, token: str, timeout: int = 10) -> Optional[Dict[str, Any]]:
    url = f"{base_url}/portal.php?type=account_info&action=get_main_info&JsHttpRequest=1-xml"
    headers = {"Authorization": f"Bearer {token}"}
    try:
        res = session.get(url, headers=headers, timeout=timeout, allow_redirects=False)
        if res.status_code == 200:
            data = json.loads(res.text)
            mac = data['js']['mac']
            expiry = data['js']['phone']
            return {"mac": mac, "expiry": expiry}
        else:
            return None
    except requests.RequestException as e:
        return None

# Function to get the channel list
def get_channel_list(session: requests.Session, base_url: str, headers: Dict[str, str], timeout: int = 10) -> Tuple[Optional[List[Dict[str, Any]]], Optional[Dict[int, str]]]:
    url_genre = f"{base_url}/server/load.php?type=itv&action=get_genres&JsHttpRequest=1-xml"
    try:
        res_genre = session.get(url_genre, headers=headers, timeout=timeout, allow_redirects=False)
        group_info = {}
        if res_genre.status_code == 200:
            id_genre = json.loads(res_genre.text)['js']
            group_info = {group['id']: group['title'] for group in id_genre}
            url3 = f"{base_url}/portal.php?type=itv&action=get_all_channels&JsHttpRequest=1-xml"
            res3 = session.get(url3, headers=headers, timeout=timeout, allow_redirects=False)
            if res3.status_code == 200:
                channels_data = json.loads(res3.text)["js"]["data"]
                return channels_data, group_info
            else:
                return None, None
        else:
            return None, None
    except requests.RequestException as e:
        return None, None

# Function to save channel list to an M3U file
def generate_m3u(base_url: str, channels_data: List[Dict[str, Any]], group_info: Dict[int, str], mac: str) -> BytesIO:
    output = BytesIO()
    output.write(b'#EXTM3U\n')
    for channel in channels_data:
        group_id = channel['tv_genre_id']
        group_name = group_info.get(group_id, "General")
        name = channel['name']
        logo = channel.get('logo', '')
        cmd_url = channel['cmds'][0]['url'].replace('ffmpeg ', '...')
        if "localhost" in cmd_url:
            ch_id_match = re.search(r'/ch/(\d+)_', cmd_url)
            if ch_id_match:
                ch_id = ch_id_match.group(1)
                cmd_url = f"{base_url}/play/live.php?mac={mac}&stream={ch_id}&extension=ts"
        
        channel_str = f'#EXTINF:-1 tvg-logo="{logo}" group-title="{group_name}",{name}\n{cmd_url}\n'
        output.write(channel_str.encode('utf-8'))

    output.seek(0)
    return output

# Function to extract panel name from the URL (base URL)
def extract_panel_name(base_url: str) -> str:
    parsed_url = urlparse(base_url)
    panel_name = parsed_url.hostname.replace('.', '_')  # Replace dots with underscores for file naming
    return panel_name

# Route to handle the form submission and get the channel list
@app.route('/get_channels', methods=['POST'])
def get_channels():
    data = request.json
    base_url = data.get('base_url')
    mac = data.get('mac')

    if not base_url or not mac:
        return jsonify({"error": "Base URL and MAC address are required"}), 400

    session = requests.Session()
    session.cookies.update({'mac': mac})
    token = get_token(session, base_url)
    
    if not token:
        return jsonify({"error": "Failed to get authentication token"}), 500

    subscription_info = get_subscription(session, base_url, token)
    if not subscription_info:
        return jsonify({"error": "Failed to get subscription info"}), 500

    headers = {"Authorization": f"Bearer {token}"}
    channels_data, group_info = get_channel_list(session, base_url, headers)
    
    if not channels_data or not group_info:
        return jsonify({"error": "Failed to get channel list"}), 500

    return jsonify({
        "mac": subscription_info['mac'],
        "expiry": subscription_info['expiry'],
        "message": "Channels are ready to download as M3U"
    })

# Route to serve the M3U file for download with dynamic filename
@app.route('/download_m3u', methods=['POST'])
def download_m3u():
    data = request.json
    base_url = data.get('base_url')
    mac = data.get('mac')

    if not base_url or not mac:
        return jsonify({"error": "Base URL and MAC address are required"}), 400

    session = requests.Session()
    session.cookies.update({'mac': mac})
    token = get_token(session, base_url)
    
    if not token:
        return jsonify({"error": "Failed to get authentication token"}), 500

    subscription_info = get_subscription(session, base_url, token)
    if not subscription_info:
        return jsonify({"error": "Failed to get subscription info"}), 500

    headers = {"Authorization": f"Bearer {token}"}
    channels_data, group_info = get_channel_list(session, base_url, headers)

    if not channels_data or not group_info:
        return jsonify({"error": "Failed to get channel list"}), 500

    m3u_file = generate_m3u(base_url, channels_data, group_info, mac)
    
    # Dynamically generate the filename based on the panel name
    panel_name = extract_panel_name(base_url)
    filename = f"{panel_name}_channels.m3u"

    return send_file(m3u_file, mimetype='application/x-mpegURL', as_attachment=True, download_name=filename)


if __name__ == '__main__':
    app.run(debug=True)
