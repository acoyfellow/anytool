---
title: Human-in-the-Loop Image Tagging with waitForEvent · Cloudflare Workflows docs
description: Human-in-the-loop Workflow with waitForEvent API
lastUpdated: 2025-08-18T14:27:42.000Z
chatbotDeprioritize: false
tags: TypeScript
source_url:
  html: https://developers.cloudflare.com/workflows/examples/wait-for-event/
  md: https://developers.cloudflare.com/workflows/examples/wait-for-event/index.md
---

This example demonstrates how to use the `waitForEvent()` API in Cloudflare Workflows to introduce a human-in-the-loop step. The Workflow is triggered by an image upload, during which metadata is stored in a D1 database. The Workflow then waits for user approval, and upon approval, it uses Workers AI to generate image tags, which are stored in the database. An accompanying Next.js frontend application facilitates the image upload and approval process.

Note

The example on this page includes only a subset of the full implementation. For the complete codebase and deployment instructions, please refer to the [GitHub repository](https://github.com/cloudflare/docs-examples/tree/main/workflows/waitForEvent).

## Overview of the Workflow

In this Workflow, we simulate a scenario where an uploaded image requires human approval before AI-based processing. An image is uploaded to R2, then Workflow performs the following steps:

1. Stores image metadata in a D1 database.
2. Pauses execution using `waitForEvent()` and waits for an external event sent from the Next.js frontend, indicating approval or rejection.
3. If approved, the Workflow uses Workers AI to generate image tags and stores the tags in the D1 database.
4. If rejected, the Workflow ends without further action.

This pattern is useful in scenarios where certain operations should not proceed without explicit human consent, adding an extra layer of control and safety.

## Frontend Integration

This example includes a Next.js frontend application that facilitates the image upload and approval process. The frontend provides an interface for uploading images, reviewing them, and approving or rejecting them. Upon image upload, the application triggers the Cloudflare Workflow, which then manages the subsequent steps, including waiting for user approval and performing AI-based image tagging upon approval.

Refer to the `/nextjs-workflow-frontend` folder in the [GitHub repository](https://github.com/cloudflare/docs-examples/tree/main/workflows/waitForEvent) for the complete frontend implementation and deployment details.

## Workflow index.ts

The `index.ts` file defines the core logic of the Cloudflare Workflow responsible for handling image uploads, awaiting human approval, and performing AI-based image tagging upon approval. It extends the `WorkflowEntrypoint` class and implements the `run()` method.

For the complete implementation of the `index.ts` file, please refer to the [GitHub repository](https://github.com/cloudflare/docs-examples/blob/main/workflows/waitForEvent/workflow/src/index.ts).

* JavaScript

  ```js
  export class MyWorkflow extends WorkflowEntrypoint {
    db;


    async run(event, step) {
      this.db = new DatabaseService(this.env.DB);
      const { imageKey } = event.payload;


      await step.do("Insert image name into database", async () => {
        await this.db.insertImage(imageKey, event.instanceId);
      });


      const waitForApproval = await step.waitForEvent(
        "Wait for AI Image tagging approval",
        {
          type: "approval-for-ai-tagging",
          timeout: "5 minute",
        },
      );


      const approvalPayload = waitForApproval.payload;
      if (approvalPayload?.approved) {
        const aiTags = await step.do("Generate AI tags", async () => {
          const image = await this.env.workflow_demo_bucket.get(imageKey);
          if (!image) throw new Error("Image not found");


          const arrayBuffer = await image.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);


          const input = {
            image: Array.from(uint8Array),
            prompt: AI_CONFIG.PROMPT,
            max_tokens: AI_CONFIG.MAX_TOKENS,
          };


          const response = await this.env.AI.run(AI_CONFIG.MODEL, input);
          return response.description;
        });


        await step.do("Update DB with AI tags", async () => {
          await this.db.updateImageTags(event.instanceId, aiTags);
        });
      }
    }
  }
  ```

* TypeScript

  ```ts
  export class MyWorkflow extends WorkflowEntrypoint<Env, WorkflowParams> {
    private db!: DatabaseService;


    async run(event: WorkflowEvent<WorkflowParams>, step: WorkflowStep) {
      this.db = new DatabaseService(this.env.DB);
      const { imageKey } = event.payload;


      await step.do('Insert image name into database', async () => {
        await this.db.insertImage(imageKey, event.instanceId);
      });


      const waitForApproval = await step.waitForEvent('Wait for AI Image tagging approval', {
        type: 'approval-for-ai-tagging',
        timeout: '5 minute',
      });


      const approvalPayload = waitForApproval.payload as ApprovalRequest;
      if (approvalPayload?.approved) {
        const aiTags = await step.do('Generate AI tags', async () => {
          const image = await this.env.workflow_demo_bucket.get(imageKey);
          if (!image) throw new Error('Image not found');


          const arrayBuffer = await image.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);


          const input = {
            image: Array.from(uint8Array),
            prompt: AI_CONFIG.PROMPT,
            max_tokens: AI_CONFIG.MAX_TOKENS,
          };


          const response = await this.env.AI.run(AI_CONFIG.MODEL, input);
          return response.description;
        });


        await step.do('Update DB with AI tags', async () => {
          await this.db.updateImageTags(event.instanceId, aiTags);
        });
      }
    }
  }
  ```

## Workflow wrangler.jsonc

The Workflow configuration is defined in the `wrangler.jsonc` file. This file includes bindings for the R2 bucket, D1 database, Workers AI, and the Workflow itself. Ensure that all necessary bindings and environment variables are correctly set up to match your Cloudflare account and services.

* wrangler.jsonc

  ```jsonc
  {
    "$schema": "node_modules/wrangler/config-schema.json",
    "name": "workflows-waitforevent",
    "main": "src/index.ts",
    "compatibility_date": "2025-04-14",
    "observability": {
      "enabled": true,
      "head_sampling_rate": 1,
    },
    "ai": {
      "binding": "AI"
    },
    "workflows": [
      {
        "name": "workflows-starter",
        "binding": "MY_WORKFLOW",
        "class_name": "MyWorkflow"
      }
    ],
    "r2_buckets": [
      {
        "bucket_name": "workflow-demo",
        "binding": "workflow_demo_bucket"
      }
    ],
    "d1_databases": [
      {
        "binding": "DB",
        "database_name": "workflows-demo-d1",
        "database_id": "66e4fbe9-06ac-4548-abba-2dc42088e13a"
      }
    ]
  }
  ```

* wrangler.toml

  ```toml
  "$schema" = "node_modules/wrangler/config-schema.json"
  name = "workflows-waitforevent"
  main = "src/index.ts"
  compatibility_date = "2025-04-14"


  [observability]
  enabled = true
  head_sampling_rate = 1


  [ai]
  binding = "AI"


  [[workflows]]
  name = "workflows-starter"
  binding = "MY_WORKFLOW"
  class_name = "MyWorkflow"


  [[r2_buckets]]
  bucket_name = "workflow-demo"
  binding = "workflow_demo_bucket"


  [[d1_databases]]
  binding = "DB"
  database_name = "workflows-demo-d1"
  database_id = "66e4fbe9-06ac-4548-abba-2dc42088e13a"
  ```

For access to the codebase, deployment instructions, and reference architecture, please visit the [GitHub repository](https://github.com/cloudflare/docs-examples/tree/main/workflows/waitForEvent). This resource provides all the necessary tools and information to effectively implement the Workflow and Next.js frontend application.
