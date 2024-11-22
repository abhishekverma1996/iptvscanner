from flask import Blueprint, request, jsonify
from flask_cors import CORS
import requests
import json
from datetime import datetime
from urllib.parse import urlparse

macscanner = Blueprint("macscanner", __name__)

# Function to scan a single MAC address
def scan_mac(base_url, mac_address):
    try:
        s = requests.Session()
        s.cookies.update({'mac': mac_address})
        url = f"{base_url}/portal.php?action=handshake&type=stb&token=&JsHttpRequest=1-xml"

        res = s.get(url, timeout=10, allow_redirects=False)
        if res.text:
            data = json.loads(res.text)
            token = data['js']['token']

            url2 = f"{base_url}/portal.php?type=account_info&action=get_main_info&JsHttpRequest=1-xml"
            headers = {"Authorization": f"Bearer {token}"}
            res2 = s.get(url2, headers=headers, timeout=5, allow_redirects=False)

            if res2.text:
                data = json.loads(res2.text)
                if 'js' in data and 'mac' in data['js'] and 'phone' in data['js']:
                    mac = data['js']['mac']
                    expiry = data['js']['phone']
                    # Third request (Get group title and id)
                    url_genre = f"{base_url}/server/load.php?type=itv&action=get_genres&JsHttpRequest=1-xml"

                    # Attempt to fetch the group id and title
                    res_genre = s.get(url_genre, headers=headers, timeout=10, allow_redirects=False)

                    group_info = {}

                    if res_genre.status_code == 200:
                        id_genre = json.loads(res_genre.text)['js']
                        for group in id_genre:
                            group_info[group['id']] = group['title']

                    # Fourth request (get all channels)
                    url3 = f"{base_url}/portal.php?type=itv&action=get_all_channels&JsHttpRequest=1-xml"

                    # Attempt to fetch the channel list
                    res3 = s.get(url3, headers=headers, timeout=5, allow_redirects=False)
                    count = 0
                    if res3.status_code == 200:
                        channels_data = json.loads(res3.text)["js"]["data"]
                        for channel in channels_data:
                            count += 1
                    else:
                        return {"mac": mac_address, "status": "Error", "message": "Failed to fetch channel list"}

                    if count == 0:
                        return {"mac": mac_address, "status": "Error", "message": "No channels found"}
                    else:
                        return {"mac": mac_address, "status": "Success", "expiry": expiry, "channel_count": count}
        else:
            return {"mac": mac_address, "status": "Error", "message": "No JSON response"}
    except requests.exceptions.RequestException as e:
        return {"mac": mac_address, "status": "Error", "message": str(e)}
    except json.decoder.JSONDecodeError:
        return {"mac": mac_address, "status": "Error", "message": "JSON decode error"}
    except Exception as e:
        return {"mac": mac_address, "status": "Error", "message": str(e)}

@macscanner.route("/scan_mac", methods=["POST"])
def scan_mac_address():
    data = request.json
    base_url = data.get("base_url")
    mac_address = data.get("mac_address")

    if not base_url or not mac_address:
        return jsonify({"error": "Base URL and MAC address are required"}), 400

    result = scan_mac(base_url, mac_address)
    return jsonify(result)
