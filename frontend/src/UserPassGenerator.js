import React, { useState } from 'react';
import randomstring from 'randomstring';
import './UserPassGenerator.css';

// Character sets for password generation
const charSets = {
  1: '0123456789', // Only numbers
  2: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', // Only letters
  3: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', // Uppercase letters
  4: 'abcdefghijklmnopqrstuvwxyz', // Lowercase letters
  5: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', // Letters + numbers
  6: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', // Uppercase + numbers
  7: 'abcdefghijklmnopqrstuvwxyz0123456789', // Lowercase + numbers
  8: '0123456789!@#$%&*', // Numbers + symbols
  9: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*', // Letters + symbols
  10: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*', // Uppercase + symbols
  11: 'abcdefghijklmnopqrstuvwxyz!@#$%&*', // Lowercase + symbols
  12: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*', // All
  13: 'abcdefghijklmnopqrstuvwxyz', // Letters only for name-based
  14: '0123456789', // Digits only for numbers
};

const generateRandomString = (length, charset) => randomstring.generate({ length, charset });

const UserPassGenerator = () => {
  const [comboCount, setComboCount] = useState(1);
  const [userLen, setUserLen] = useState(8);
  const [passLen, setPassLen] = useState(12);
  const [selectedType, setSelectedType] = useState(1); // Default is only numbers
  const [userPassCombos, setUserPassCombos] = useState([]);

  const handleGenerateCombos = () => {
    const userPassArr = [];

    for (let i = 0; i < comboCount; i++) {
      let username, password;

      switch (selectedType) {
        // Old options (default types)
        case 1: // Numbers Only
          username = generateRandomString(userLen, charSets[1]);
          password = generateRandomString(passLen, charSets[1]);
          break;
        case 2: // Letters Only
          username = generateRandomString(userLen, charSets[2]);
          password = generateRandomString(passLen, charSets[2]);
          break;
        case 3: // Uppercase Letters
          username = generateRandomString(userLen, charSets[3]);
          password = generateRandomString(passLen, charSets[3]);
          break;
        case 4: // Lowercase Letters
          username = generateRandomString(userLen, charSets[4]);
          password = generateRandomString(passLen, charSets[4]);
          break;
        case 5: // Letters and Numbers
          username = generateRandomString(userLen, charSets[5]);
          password = generateRandomString(passLen, charSets[5]);
          break;
        case 6: // Uppercase + Numbers
          username = generateRandomString(userLen, charSets[6]);
          password = generateRandomString(passLen, charSets[6]);
          break;
        case 7: // Lowercase + Numbers
          username = generateRandomString(userLen, charSets[7]);
          password = generateRandomString(passLen, charSets[7]);
          break;
        case 8: // Numbers + Symbols
          username = generateRandomString(userLen, charSets[8]);
          password = generateRandomString(passLen, charSets[8]);
          break;
        case 9: // Letters + Symbols
          username = generateRandomString(userLen, charSets[9]);
          password = generateRandomString(passLen, charSets[9]);
          break;
        case 10: // Uppercase Letters + Symbols
          username = generateRandomString(userLen, charSets[10]);
          password = generateRandomString(passLen, charSets[10]);
          break;
        case 11: // Lowercase Letters + Symbols
          username = generateRandomString(userLen, charSets[11]);
          password = generateRandomString(passLen, charSets[11]);
          break;
        case 12: // All (Numbers, Letters, Symbols)
          username = generateRandomString(userLen, charSets[12]);
          password = generateRandomString(passLen, charSets[12]);
          break;

        // New custom options (your list)
        case 13: // User: User Numbered
          username = `user${i + 1}`;
          password = `pass${i + 1}`;
          break;
        case 14: // Mail: Pass
          username = `user${i + 1}@example.com`;
          password = generateRandomString(passLen, charSets[12]);
          break;
        case 15: // User: Pass Names
          username = generateRandomString(userLen, charSets[13]);
          password = generateRandomString(passLen, charSets[13]);
          break;
        case 16: // User: Pass Names Matching
          username = generateRandomString(userLen, charSets[13]);
          password = username; // Matching username and password
          break;
        case 17: // FirstLast: FirstLast
          username = `JohnDoe${i + 1}`;
          password = `JohnDoe${i + 1}`;
          break;
        case 18: // Mail
          username = `user${i + 1}@example.com`;
          password = generateRandomString(passLen, charSets[12]);
          break;
        case 19: // Pass
          username = generateRandomString(userLen, charSets[13]);
          password = generateRandomString(passLen, charSets[12]);
          break;
        case 20: // User: User Matching
          username = generateRandomString(userLen, charSets[13]);
          password = username; // Matching username and password
          break;
        case 21: // User
          username = generateRandomString(userLen, charSets[13]);
          password = generateRandomString(passLen, charSets[12]);
          break;
        case 22: // User: Pass Numbers
          username = generateRandomString(userLen, charSets[13]);
          password = generateRandomString(passLen, charSets[14]); // Only numbers
          break;
        case 23: // Mac Combo Generating
          username = generateRandomString(userLen, charSets[12]);
          password = `00:${generateRandomString(2, charSets[14])}:${generateRandomString(2, charSets[14])}:${generateRandomString(2, charSets[14])}:${generateRandomString(2, charSets[14])}:${generateRandomString(2, charSets[14])}`;
          break;
        case 24: // foreign: User Numbered
          username = `user${i + 1}`;
          password = `foreign${i + 1}`;
          break;
        case 25: // foreign: User Matching
          username = `user${i + 1}`;
          password = username; // Matching user-password
          break;
        case 26: // User: Birth year
          username = generateRandomString(userLen, charSets[13]);
          password = `20${Math.floor(Math.random() * 100)}`;
          break;
        case 27: // User: Pass: Birth year
          username = generateRandomString(userLen, charSets[13]);
          password = generateRandomString(passLen, charSets[12]);
          break;
        case 28: // User: Pass (2 Num)
          username = generateRandomString(userLen, charSets[13]);
          password = `${generateRandomString(passLen - 2, charSets[13])}${generateRandomString(2, charSets[14])}`;
          break;
        case 29: // User: Pass (4 Num)
          username = generateRandomString(userLen, charSets[13]);
          password = `${generateRandomString(passLen - 4, charSets[13])}${generateRandomString(4, charSets[14])}`;
          break;
        case 30: // User: Pass (123 User)
          username = generateRandomString(userLen, charSets[13]);
          password = `123${generateRandomString(passLen - 3, charSets[13])}`;
          break;
        case 31: // User: User (User:name/User:last)
          username = `JohnDoe${i + 1}`;
          password = username; // Matching name-based
          break;
        case 32: // User: User (User:name/User:numbered)
          username = `User${i + 1}`;
          password = username;
          break;
        case 33: // User: User (User:last/User:lastnum)
          username = `Doe${i + 1}`;
          password = username;
          break;
        case 34: // User: User (User:name/User:namenumber)
          username = `User${i + 1}`;
          password = `User${i + 1}`;
          break;
        case 35: // User matching
          username = generateRandomString(userLen, charSets[13]);
          password = username; // Matching user-password
          break;
        case 36: // User matching
          username = generateRandomString(userLen, charSets[13]);
          password = `${generateRandomString(passLen - 3, charSets[13])}123`;
          break;
        default:
          username = generateRandomString(userLen, charSets[1]);
          password = generateRandomString(passLen, charSets[1]);
          break;
      }

      userPassArr.push(`${username}:${password}`);
    }

    setUserPassCombos(userPassArr);
  };

  const handleDownloadCombos = () => {
    const comboText = userPassCombos.join('\n');
    const blob = new Blob([comboText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'user_pass_combos.txt';
    link.click();
  };

  return (
    <div className="userpass-generator">
      <h2>User and Password Combo Generator</h2>

      {/* Combo Type Selection */}
      <label>Choose Combo Type:</label>
      <select value={selectedType} onChange={(e) => setSelectedType(parseInt(e.target.value))}>
        {/* Old Options */}
        <option value={1}>Numbers Only</option>
        <option value={2}>Letters Only</option>
        <option value={3}>Uppercase Letters</option>
        <option value={4}>Lowercase Letters</option>
        <option value={5}>Letters and Numbers</option>
        <option value={6}>Uppercase Letters and Numbers</option>
        <option value={7}>Lowercase Letters and Numbers</option>
        <option value={8}>Numbers and Symbols</option>
        <option value={9}>Letters and Symbols</option>
        <option value={10}>Uppercase Letters and Symbols</option>
        <option value={11}>Lowercase Letters and Symbols</option>
        <option value={12}>All (Numbers, Letters, and Symbols)</option>

        {/* New Options */}
        <option value={13}>User: User Numbered</option>
        <option value={14}>Mail: Pass</option>
        <option value={15}>User: Pass Names</option>
        <option value={16}>User: Pass Names Matching</option>
        <option value={17}>FirstLast: FirstLast</option>
        <option value={18}>Mail</option>
        <option value={19}>Pass</option>
        <option value={20}>User: User Matching</option>
        <option value={21}>User</option>
        <option value={22}>User: Pass Numbers</option>
        <option value={23}>Mac Combo Generating</option>
        <option value={24}>Foreign: User Numbered</option>
        <option value={25}>Foreign: User Matching</option>
        <option value={26}>User: Birth Year</option>
        <option value={27}>User: Pass: Birth Year</option>
        <option value={28}>User: Pass (2 Num)</option>
        <option value={29}>User: Pass (4 Num)</option>
        <option value={30}>User: Pass (123 User)</option>
        <option value={36}>User: Pass (User 123)</option>
        <option value={31}>User: User (User:name/User:last)</option>
        <option value={32}>User: User (User:name/User:numbered)</option>
        <option value={33}>User: User (User:last/User:lastnum)</option>
        <option value={34}>User: User (User:name/User:namenumber)</option>
        <option value={35}>User matching</option>
      </select>

      <br /><br />

      {/* Number of Combos */}
      <label>Number of Combos:</label>
      <input
        type="number"
        value={comboCount}
        onChange={(e) => setComboCount(parseInt(e.target.value))}
        min="1"
        className="input-field"
      />

      <br /><br />

      {/* Username Length */}
      <label>Username Length:</label>
      <input
        type="number"
        value={userLen}
        onChange={(e) => setUserLen(parseInt(e.target.value))}
        min="1"
        className="input-field"
      />

      <br /><br />

      {/* Password Length */}
      <label>Password Length:</label>
      <input
        type="number"
        value={passLen}
        onChange={(e) => setPassLen(parseInt(e.target.value))}
        min="1"
        className="input-field"
      />

      <br /><br />

      <button onClick={handleGenerateCombos} className="generate-btn">
        Generate Combos
      </button>

      <br /><br />

      {userPassCombos.length > 0 && (
        <div className="generated-combos">
          <h3>Generated Combos:</h3>
          <div className="scrollable-area">
            <ul>
              {userPassCombos.map((combo, index) => (
                <li key={index}>{combo}</li>
              ))}
            </ul>
          </div>
          <button onClick={handleDownloadCombos} className="download-btn">
            Download Combos
          </button>
        </div>
      )}
    </div>
  );
};

export default UserPassGenerator;
