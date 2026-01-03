
# Nexus Newsroom OS - Installation Manual

**Version:** 2.1.0 Universal  
**Date:** October 2023

## 1. System Requirements

*   **API Keys:** Google Gemini API Key (Required).
*   **Browser:** Modern Chrome, Firefox, or Edge.

---

## 2. cPanel Installation (Shared Hosting)

Nexus OS is optimized for standard cPanel environments using Apache.

### Step 1: Prepare the Package
1.  Download the **cPanel Installer Package** (`nexus-os-cpanel.zip`) from your distribution source.
2.  *Or compile manually:* Run `./scripts/build_release.sh` in the source folder.

### Step 2: Upload to cPanel
1.  Login to **cPanel**.
2.  Open **File Manager**.
3.  Navigate to `public_html` (or your subdomain folder).
4.  Click **Upload** and select `nexus-os-cpanel.zip`.
5.  Right-click the zip file and select **Extract**.

### Step 3: Verification
1.  Ensure the `.htaccess` file is present in the folder (you may need to enable "Show Hidden Files" in Settings).
2.  Open your website URL.
3.  **Important:** The first time you load the app, go to **Settings > AI Intelligence Hub** to input your Gemini API Key.

---

## 3. VPS / Webmin Installation

For Virtual Private Servers (DigitalOcean, Vultr, Linode, AWS) or servers managed via Webmin.

### Step 1: Access Terminal
1.  SSH into your server: `ssh root@your-ip`
2.  *Or via Webmin:* Go to **Tools > Terminal**.

### Step 2: Run Auto-Installer
Copy and paste the following command:

```bash
curl -O https://raw.githubusercontent.com/nexus-os/core/main/scripts/install_vps.sh
chmod +x install_vps.sh
sudo ./install_vps.sh
```

*(Note: If installing from a local zip, upload `nexus-os-cpanel.zip` and `install_vps.sh` to the same folder before running).*

### Step 3: SSL Setup (Optional)
To enable HTTPS (Green Lock):
```bash
apt-get install certbot python3-certbot-nginx
certbot --nginx
```

---

## 4. Docker Enterprise Installation

For Kubernetes or containerized environments.

1.  **Build:** `docker build -t nexus-os .`
2.  **Run:** `docker run -d -p 80:80 -e API_KEY=your_key nexus-os`

---

## 5. Troubleshooting

*   **404 on Refresh (cPanel):** Verify `.htaccess` exists in `public_html`. It handles the routing rules.
*   **"API Key Missing" Error:** The app runs client-side. You must enter the key in the Settings UI on the first launch.
*   **Permissions Error (VPS):** Run `chown -R www-data:www-data /var/www/nexus-os` to ensure Nginx can read the files.

**Support:** enterprise@nexus-os.com
