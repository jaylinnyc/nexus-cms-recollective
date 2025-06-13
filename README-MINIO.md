# MinIO Bucket Setup Guide

This guide explains how to:

1. Enable webhook notifications on a MinIO bucket
2. Make a MinIO bucket publicly accessible for anonymous downloads

---

## 🛠️ Prerequisites

- MinIO server running and accessible (e.g., via `https://media.example.com`)
- MinIO Client (`mc`) installed and configured
- Access to the MinIO container’s environment configuration (e.g., via `docker-compose`)

---

## 1. 🔔 Enable Webhook Notification Events

### Step 1: Add webhook environment variables

In your `docker-compose.yml` or `.env` file for the MinIO service, define the notification configuration using **UPPERCASE** webhook ID (e.g., `RESIZER`):

```yaml
environment:
  MINIO_NOTIFY_WEBHOOK_ENABLE_RESIZER: "on"
  MINIO_NOTIFY_WEBHOOK_ENDPOINT_RESIZER: "http://bf-image-resizer:8080/events"
  MINIO_NOTIFY_WEBHOOK_QUEUE_DIR_RESIZER: "/data/.minio.sys/queue"
  MINIO_NOTIFY_WEBHOOK_QUEUE_LIMIT_RESIZER: "0"
```

> ⚠️ Note: `RESIZER` is the webhook ID and must match exactly in later steps (case-sensitive)

### Step 2: Restart MinIO

```bash
docker-compose restart bf-minio
```

### Step 3: Confirm MinIO picked up the webhook

```bash
mc alias set bfminio https://media.example.com <ACCESS_KEY> <SECRET_KEY>
mc admin config get bfminio notify_webhook
```

Look for:

```text
notify_webhook:RESIZER
  enable: "on"
  endpoint: "http://bf-image-resizer:8080/events"
  ...
```

### Step 4: Attach the webhook to a bucket

```bash
mc event add bfminio/<bucket-name> arn:minio:sqs::RESIZER:webhook --event put
```

Replace `<bucket-name>` with your actual bucket name.

---

## 2. 🌍 Make a Bucket Publicly Accessible

### Step 1: Set anonymous policy for read/download

```bash
mc anonymous set download bfminio/<bucket-name>
```

This allows public read-only access to objects in the bucket.

### Step 2: Test access

Visit a file via:

```
https://media.example.com/<bucket-name>/<object-name>
```

---

## ✅ Example

```bash
mc alias set bfminio https://media.recollectivect.com nextstep nextstep
mc anonymous set download bfminio/public
mc event add bfminio/public arn:minio:sqs::RESIZER:webhook --event put
```

---

## 🔍 Reference

- MinIO Notification Targets: https://min.io/docs/minio/linux/notifications/overview.html
- MinIO `mc` CLI: https://min.io/docs/minio/linux/reference/minio-mc.html