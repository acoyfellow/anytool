---
title: Build an end to end data pipeline · R2 SQL docs
description: In this tutorial, you will learn how to build a complete data
  pipeline using Cloudflare Pipelines, R2 Data Catalog, and R2 SQL. This also
  includes a sample Python script that creates and sends financial transaction
  data to your Pipeline that can be queried by R2 SQL or any Apache
  Iceberg-compatible query engine.
lastUpdated: 2025-09-25T04:13:57.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/r2-sql/tutorials/end-to-end-pipeline/
  md: https://developers.cloudflare.com/r2-sql/tutorials/end-to-end-pipeline/index.md
---

In this tutorial, you will learn how to build a complete data pipeline using Cloudflare Pipelines, R2 Data Catalog, and R2 SQL. This also includes a sample Python script that creates and sends financial transaction data to your Pipeline that can be queried by R2 SQL or any Apache Iceberg-compatible query engine.

This tutorial demonstrates how to:

* Set up R2 Data Catalog to store our transaction events in an Apache Iceberg table
* Set up a Cloudflare Pipeline
* Create transaction data with fraud patterns to send to your Pipeline
* Query your data using R2 SQL for fraud analysis

## Prerequisites

1. Sign up for a [Cloudflare account](https://dash.cloudflare.com/sign-up).
2. Install [Node.js](https://nodejs.org/en/).
3. Install [Python 3.8+](https://python.org) for the data generation script.

Node.js version manager

Use a Node version manager like [Volta](https://volta.sh/) or [nvm](https://github.com/nvm-sh/nvm) to avoid permission issues and change Node.js versions.

Wrangler requires a Node version of 16.17.0 or later.

## 1. Set up authentication

You will need API tokens to interact with Cloudflare services.

1. In the Cloudflare dashboard, go to the **API tokens** page.

   [Go to **Account API tokens**](https://dash.cloudflare.com/?to=/:account/api-tokens)

2. Select **Create Token**.

3. Select **Get started** next to Create Custom Token.

4. Enter a name for your API token.

5. Under **Permissions**, choose:

   * **Workers Pipelines** with Read, Send, and Edit permissions
   * **Workers R2 Data Catalog** with Read and Edit permissions
   * **Workers R2 SQL** with Read permissions
   * **Workers R2 Storage** with Read and Edit permissions

6. Optionally, add a TTL to this token.

7. Select **Continue to summary**.

8. Click **Create Token**

9. Note the **Token value**.

Export your new token as an environment variable:

```bash
export WRANGLER_R2_SQL_AUTH_TOKEN= #paste your token here
```

If this is your first time using Wrangler, make sure to log in.

```bash
npx wrangler login
```

## 2. Create an R2 bucket and enable R2 Data Catalog

* Wrangler CLI

  Create an R2 bucket:

  ```bash
  npx wrangler r2 bucket create fraud-pipeline
  ```

* Dashboard

  1. In the Cloudflare dashboard, go to the **R2 object storage** page.

     [Go to **Overview**](https://dash.cloudflare.com/?to=/:account/r2/overview)

  2. Select **Create bucket**.

  3. Enter the bucket name: `fraud-pipeline`

  4. Select **Create bucket**.

Enable the catalog on your R2 bucket:

* Wrangler CLI

  ```bash
  npx wrangler r2 bucket catalog enable fraud-pipeline
  ```

  When you run this command, take note of the "Warehouse" and "Catalog URI". You will need these later.

* Dashboard

  1. In the Cloudflare dashboard, go to the **R2 object storage** page.

     [Go to **Overview**](https://dash.cloudflare.com/?to=/:account/r2/overview)

  2. Select the bucket: `fraud-pipeline`.

  3. Switch to the **Settings** tab, scroll down to **R2 Data Catalog**, and select **Enable**.

  4. Once enabled, note the **Catalog URI** and **Warehouse name**.

Note

Copy the `warehouse` (ACCOUNTID\_BUCKETNAME) and paste it in the `export` below. We will use it later in the tutorial.

```bash
export $WAREHOUSE= #Paste your warehouse here
```

### (Optional) Enable compaction on your R2 Data Catalog

R2 Data Catalog can automatically compact tables for you. In production event streaming use cases, it is common to end up with many small files, so it is recommended to enable compaction. Since the tutorial only demonstrates a sample use case, this step is optional.

* Wrangler CLI

  ```bash
  npx wrangler r2 bucket catalog compaction enable fraud-pipeline --token $WRANGLER_R2_SQL_AUTH_TOKEN
  ```

* Dashboard

  1. In the Cloudflare dashboard, go to the **R2 object storage** page.

     [Go to **Overview**](https://dash.cloudflare.com/?to=/:account/r2/overview)

  2. Select the bucket: `fraud-pipeline`.

  3. Switch to the **Settings** tab, scroll down to **R2 Data Catalog**, click on edit icon, and select **Enable**.

  4. You can choose a target file size or leave the default. Click save.

## 3. Set up the pipeline infrastructure

### 3.1. Create the Pipeline stream

* Wrangler CLI

  First, create a schema file called `raw_transactions_schema.json` with the following `json` schema:

  ```json
  {
      "fields": [
        {"name": "transaction_id", "type": "string", "required": true},
        {"name": "user_id", "type": "int64", "required": true},
        {"name": "amount", "type": "float64", "required": false},
        {"name": "transaction_timestamp", "type": "string", "required": false},
        {"name": "location", "type": "string", "required": false},
        {"name": "merchant_category", "type": "string", "required": false},
        {"name": "is_fraud", "type": "bool", "required": false}
      ]
  }
  ```

  Create a stream to receive incoming fraud detection events:

  ```bash
  npx wrangler pipelines streams create raw_events_stream \
    --schema-file raw_transactions_schema.json \
    --http-enabled true \
    --http-auth false
  ```

  Note

  Note the **HTTP Ingest Endpoint URL** from the output. This is the endpoint you will use to send data to your pipeline.

  ```bash
  # The http ingest endpoint from the output (see example below)
  export STREAM_ENDPOINT= #the http ingest endpoint from the output (see example below)
  ```

  The output should look like this:

  ```sh
  🌀 Creating stream 'raw_events_stream'...
  ✨ Successfully created stream 'raw_events_stream' with id 'stream_id'.


  Creation Summary:
  General:
    Name:  raw_events_stream


  HTTP Ingest:
    Enabled:         Yes
    Authentication:  Yes
    Endpoint:        https://stream_id.ingest.cloudflare.com
    CORS Origins:    None


  Input Schema:
  ┌───────────────────────┬────────┬────────────┬──────────┐
  │ Field Name            │ Type   │ Unit/Items │ Required │
  ├───────────────────────┼────────┼────────────┼──────────┤
  │ transaction_id        │ string │            │ Yes      │
  ├───────────────────────┼────────┼────────────┼──────────┤
  │ user_id               │ int64  │            │ Yes      │
  ├───────────────────────┼────────┼────────────┼──────────┤
  │ amount                │float64 │            │ No       │
  ├───────────────────────┼────────┼────────────┼──────────┤
  │ transaction_timestamp │ string │            │ No       │
  ├───────────────────────┼────────┼────────────┼──────────┤
  │ location              │ string │            │ No       │
  ├───────────────────────┼────────┼────────────┼──────────┤
  │ merchant_category     │ string │            │ No       │
  ├───────────────────────┼────────┼────────────┼──────────┤
  │ is_fraud              │ bool   │            │ No       │
  └───────────────────────┴────────┴────────────┴──────────┘
  ```

  ### 3.2. Create the data sink

  Create a sink that writes data to your R2 bucket as Apache Iceberg tables:

  ```bash
  npx wrangler pipelines sinks create raw_events_sink \
    --type "r2-data-catalog" \
    --bucket "fraud-pipeline" \
    --roll-interval 30 \
    --namespace "fraud_detection" \
    --table "transactions" \
    --catalog-token $WRANGLER_R2_SQL_AUTH_TOKEN
  ```

  Note

  This creates a `sink` configuration that will write to the Iceberg table `fraud_detection.transactions` in your R2 Data Catalog every 30 seconds. Pipelines automatically appends an `__ingest_ts` column that is used to partition the table by `DAY`.

  ### 3.3. Create the pipeline

  Connect your stream to your sink with SQL:

  ```bash
  npx wrangler pipelines create raw_events_pipeline \
    --sql "INSERT INTO raw_events_sink SELECT * FROM raw_events_stream"
  ```

* Dashboard

  1. In the Cloudflare dashboard, go to **Pipelines** > **Pipelines**.

     [Go to **Pipelines**](https://dash.cloudflare.com/?to=/:account/pipelines)

  2. Select **Create Pipeline**.

  3. **Connect to a Stream**:

     * Pipeline name: `raw_events`
     * Enable HTTP endpoint for sending data: Enabled
     * HTTP authentication: Disabled (default)
     * Select **Next**

  4. **Define Input Schema**:

     * Select **JSON editor**

     * Copy in the schema:

       ```json
       {
         "fields": [
             {"name": "transaction_id", "type": "string", "required": true},
             {"name": "user_id", "type": "int64", "required": true},
             {"name": "amount", "type": "float64", "required": false},
             {"name": "transaction_timestamp", "type": "string", "required": false},
             {"name": "location", "type": "string", "required": false},
             {"name": "merchant_category", "type": "string", "required": false},
             {"name": "is_fraud", "type": "bool", "required": false}
         ]
       }
       ```

     * Select **Next**

  5. **Define Sink**:

     * Select your R2 bucket: `fraud-pipeline`
     * Storage type: **R2 Data Catalog**
     * Namespace: `fraud_detection`
     * Table name: `transactions`
     * **Advanced Settings**: Change **Maximum Time Interval** to `30 seconds`
     * Select **Next**

  6. **Credentials**:

     * Disable **Automatically create an Account API token for your sink**
     * Enter **Catalog Token** from step 1
     * Select **Next**

  7. **Pipeline Definition**:

     * Leave the default SQL query:

       ```sql
       INSERT INTO raw_events_sink SELECT * FROM raw_events_stream;
       ```

     * Select **Create Pipeline**

  8. After pipeline creation, note the **Stream ID** for the next step.

## 4. Generate sample fraud detection data

Create a Python script to generate realistic transaction data with fraud patterns:

```python
import requests
import json
import uuid
import random
import time
import os
from datetime import datetime, timezone, timedelta


# Configuration - exported from the prior steps
STREAM_ENDPOINT = os.environ["STREAM_ENDPOINT"]# From the stream you created
API_TOKEN = os.environ["WRANGLER_R2_SQL_AUTH_TOKEN"] #the same one created earlier
EVENTS_TO_SEND = 1000 # Feel free to adjust this


def generate_transaction():
    """Generate some random transactions with occasional fraud"""


    # User IDs
    high_risk_users = [1001, 1002, 1003, 1004, 1005]
    normal_users = list(range(1006, 2000))


    user_id = random.choice(high_risk_users + normal_users)
    is_high_risk_user = user_id in high_risk_users


    # Generate amounts
    if random.random() < 0.05:
        amount = round(random.uniform(5000, 50000), 2)
    elif random.random() < 0.03:
        amount = round(random.uniform(0.01, 1.00), 2)
    else:
        amount = round(random.uniform(10, 500), 2)


    # Locations
    normal_locations = ["NEW_YORK", "LOS_ANGELES", "CHICAGO", "MIAMI", "SEATTLE", "SAN FRANCISCO"]
    high_risk_locations = ["UNKNOWN_LOCATION", "VPN_EXIT", "MARS", "BAT_CAVE"]


    if is_high_risk_user and random.random() < 0.3:
        location = random.choice(high_risk_locations)
    else:
        location = random.choice(normal_locations)


    # Merchant categories
    normal_merchants = ["GROCERY", "GAS_STATION", "RESTAURANT", "RETAIL"]
    high_risk_merchants = ["GAMBLING", "CRYPTO", "MONEY_TRANSFER", "GIFT_CARDS"]


    if random.random() < 0.1:  # 10% high-risk merchants
        merchant_category = random.choice(high_risk_merchants)
    else:
        merchant_category = random.choice(normal_merchants)


    # Series of checks to either increase fraud score by a certain margin
    fraud_score = 0
    if amount > 2000: fraud_score += 0.4
    if amount < 1: fraud_score += 0.3
    if location in high_risk_locations: fraud_score += 0.5
    if merchant_category in high_risk_merchants: fraud_score += 0.3
    if is_high_risk_user: fraud_score += 0.2


    # Compare the fraud scores
    is_fraud = random.random() < min(fraud_score * 0.3, 0.8)


    # Generate timestamps (some fraud happens at unusual hours)
    base_time = datetime.now(timezone.utc)
    if is_fraud and random.random() < 0.4:  # 40% of fraud at night
        hour = random.randint(0, 5)  # Late night/early morning
        transaction_time = base_time.replace(hour=hour)
    else:
        transaction_time = base_time - timedelta(
            hours=random.randint(0, 168)  # Last week
        )


    return {
        "transaction_id": str(uuid.uuid4()),
        "user_id": user_id,
        "amount": amount,
        "transaction_timestamp": transaction_time.isoformat(),
        "location": location,
        "merchant_category": merchant_category,
        "is_fraud": True if is_fraud else False
    }


def send_batch_to_stream(events, batch_size=100):
    """Send events to Cloudflare Stream in batches"""


    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }


    total_sent = 0
    fraud_count = 0


    for i in range(0, len(events), batch_size):
        batch = events[i:i + batch_size]
        fraud_in_batch = sum(1 for event in batch if event["is_fraud"] == True)


        try:
            response = requests.post(STREAM_ENDPOINT, headers=headers, json=batch)


            if response.status_code in [200, 201]:
                total_sent += len(batch)
                fraud_count += fraud_in_batch
                print(f"Sent batch of {len(batch)} events (Total: {total_sent})")
            else:
                print(f"Failed to send batch: {response.status_code} - {response.text}")


        except Exception as e:
            print(f"Error sending batch: {e}")


        time.sleep(0.1)


    return total_sent, fraud_count


def main():
    print("Generating fraud detection data...")


    # Generate events
    events = []
    for i in range(EVENTS_TO_SEND):
        events.append(generate_transaction())
        if (i + 1) % 100 == 0:
            print(f"Generated {i + 1} events...")


    fraud_events = sum(1 for event in events if event["is_fraud"] == True)
    print(f"📊 Generated {len(events)} total events ({fraud_events} fraud, {fraud_events/len(events)*100:.1f}%)")


    # Send to stream
    print("Sending data to Pipeline stream...")
    sent, fraud_sent = send_batch_to_stream(events)


    print(f"\nComplete!")
    print(f"   Events sent: {sent:,}")
    print(f"   Fraud events: {fraud_sent:,} ({fraud_sent/sent*100:.1f}%)")
    print(f"   Data is now flowing through your pipeline!")


if __name__ == "__main__":
    main()
```

Install the required Python dependency and run the script:

```bash
pip install requests
python fraud_data_generator.py
```

## 5. Query the data with R2 SQL

Now you can analyze your fraud detection data using R2 SQL. Here are some example queries:

### 5.1. View recent transactions

```bash
npx wrangler r2 sql query "$WAREHOUSE" "
SELECT
    transaction_id,
    user_id,
    amount,
    location,
    merchant_category,
    is_fraud,
    transaction_timestamp
FROM fraud_detection.transactions
WHERE __ingest_ts > '2025-09-24T01:00:00Z'
AND is_fraud = true
LIMIT 10"
```

### 5.2. Filter the raw transactions into a new table to highlight high-value transactions

Create a new sink that will write the filtered data to a new Apache Iceberg table in R2 Data Catalog:

```bash
npx wrangler pipelines sinks create fraud_filter_sink \
  --type "r2-data-catalog" \
  --bucket "fraud-pipeline" \
  --roll-interval 30 \
  --namespace "fraud_detection" \
  --table "fraud_transactions" \
  --catalog-token $WRANGLER_R2_SQL_AUTH_TOKEN
```

Now you will create a new SQL query to process data from the original `raw_events_stream` stream and only write flagged transactions that are over the `amount` of 1,000.

```bash
npx wrangler pipelines create fraud_events_pipeline \
  --sql "INSERT INTO fraud_filter_sink SELECT * FROM raw_events_stream WHERE is_fraud=true and amount > 1000"
```

Note

It may take a few minutes for the new Pipeline to fully Initialize and start processing the data. Also keep in mind the 30 second `roll-interval`.

Query the table and check the results:

```bash
npx wrangler r2 sql query "$WAREHOUSE" "
SELECT
    transaction_id,
    user_id,
    amount,
    location,
    merchant_category,
    is_fraud,
    transaction_timestamp
FROM fraud_detection.fraud_transactions
LIMIT 10"
```

Also verify that the non-fraudulent events are being filtered out:

```bash
npx wrangler r2 sql query "$WAREHOUSE" "
SELECT
    transaction_id,
    user_id,
    amount,
    location,
    merchant_category,
    is_fraud,
    transaction_timestamp
FROM fraud_detection.fraud_transactions
WHERE is_fraud = false
LIMIT 10"
```

You should see the following output:

```text
Query executed successfully with no results
```

## Conclusion

You have successfully built an end to end data pipeline using Cloudflare's data platform. Through this tutorial, you hve learned to:

1. **Use R2 Data Catalog**: Leveraged Apache Iceberg tables for efficient data storage
2. **Set up Cloudflare Pipelines**: Created streams, sinks, and pipelines for data ingestion
3. **Generated sample data**: Created transaction data with some basic fraud patterns
4. **Query your tables with R2 SQL**: Access raw and processed data tables stored in R2 Data Catalog
