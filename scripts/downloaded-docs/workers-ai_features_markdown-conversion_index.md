---
title: Markdown Conversion · Cloudflare Workers AI docs
description: Markdown is essential for text generation and large language models
  (LLMs) in training and inference because it can provide structured, semantic,
  human, and machine-readable input. Likewise, Markdown facilitates chunking and
  structuring input data for better retrieval and synthesis in the context of
  RAGs, and its simplicity and ease of parsing and rendering make it ideal for
  AI Agents.
lastUpdated: 2025-04-16T13:44:03.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/workers-ai/features/markdown-conversion/
  md: https://developers.cloudflare.com/workers-ai/features/markdown-conversion/index.md
---

[Markdown](https://en.wikipedia.org/wiki/Markdown) is essential for text generation and large language models (LLMs) in training and inference because it can provide structured, semantic, human, and machine-readable input. Likewise, Markdown facilitates chunking and structuring input data for better retrieval and synthesis in the context of RAGs, and its simplicity and ease of parsing and rendering make it ideal for AI Agents.

For these reasons, document conversion plays an important role when designing and developing AI applications. Workers AI provides the `toMarkdown` utility method that developers can use from the [`env.AI`](https://developers.cloudflare.com/workers-ai/configuration/bindings/) binding or the REST APIs for quick, easy, and convenient conversion and summary of documents in multiple formats to Markdown language.

## Methods and definitions

### async env.AI.toMarkdown()

Takes a list of documents in different formats and converts them to Markdown.

#### Parameter

* `documents`: array- An array of `toMarkdownDocument`s.

#### Return values

* `results`: array- An array of `toMarkdownDocumentResult`s.

### `toMarkdownDocument` definition

* `name` string

  * Name of the document to convert.

* `blob` Blob

  * A new [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob) object with the document content.

### `toMarkdownDocumentResult` definition

* `name` string

  * Name of the converted document. Matches the input name.

* `mimetype` string

  * The detected [mime type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types/Common_types) of the document.

* `tokens` number

  * The estimated number of tokens of the converted document.

* `data` string

  * The content of the converted document in Markdown format.

## Supported formats

This is the list of support formats. We are constantly adding new formats and updating this table.

| Format | File extensions | Mime Types |
| - | - | - |
| PDF Documents | `.pdf` | `application/pdf` |
| Images 1 | `.jpeg`, `.jpg`, `.png`, `.webp`, `.svg` | `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml` |
| HTML Documents | `.html` | `text/html` |
| XML Documents | `.xml` | `application/xml` |
| Microsoft Office Documents | `.xlsx`, `.xlsm`, `.xlsb`, `.xls`, `.et`, `.docx` | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `application/vnd.ms-excel.sheet.macroenabled.12`, `application/vnd.ms-excel.sheet.binary.macroenabled.12`, `application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |
| Open Document Format | `.ods`, `.odt` | `application/vnd.oasis.opendocument.spreadsheet`, `application/vnd.oasis.opendocument.text` |
| CSV | `.csv` | `text/csv` |
| Apple Documents | `.numbers` | `application/vnd.apple.numbers` |

1 Image conversion uses two Workers AI models for object detection and summarization. See [Workers AI pricing](https://developers.cloudflare.com/workers-ai/features/markdown-conversion/#pricing) for more details.

## Example

In this example, we fetch a PDF document and an image from R2 and feed them both to `env.AI.toMarkdown`. The result is a list of converted documents. Workers AI models are used automatically to detect and summarize the image.

```typescript
import { Env } from "./env";


export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    // https://pub-979cb28270cc461d94bc8a169d8f389d.r2.dev/somatosensory.pdf
    const pdf = await env.R2.get("somatosensory.pdf");


    // https://pub-979cb28270cc461d94bc8a169d8f389d.r2.dev/cat.jpeg
    const cat = await env.R2.get("cat.jpeg");


    return Response.json(
      await env.AI.toMarkdown([
        {
          name: "somatosensory.pdf",
          blob: new Blob([await pdf.arrayBuffer()], {
            type: "application/octet-stream",
          }),
        },
        {
          name: "cat.jpeg",
          blob: new Blob([await cat.arrayBuffer()], {
            type: "application/octet-stream",
          }),
        },
      ]),
    );
  },
};
```

This is the result:

```json
[
  {
    "name": "somatosensory.pdf",
    "mimeType": "application/pdf",
    "format": "markdown",
    "tokens": 0,
    "data": "# somatosensory.pdf\n## Metadata\n- PDFFormatVersion=1.4\n- IsLinearized=false\n- IsAcroFormPresent=false\n- IsXFAPresent=false\n- IsCollectionPresent=false\n- IsSignaturesPresent=false\n- Producer=Prince 20150210 (www.princexml.com)\n- Title=Anatomy of the Somatosensory System\n\n## Contents\n### Page 1\nThis is a sample document to showcase..."
  },
  {
    "name": "cat.jpeg",
    "mimeType": "image/jpeg",
    "format": "markdown",
    "tokens": 0,
    "data": "The image is a close-up photograph of Grumpy Cat, a cat with a distinctive grumpy expression and piercing blue eyes. The cat has a brown face with a white stripe down its nose, and its ears are pointed upright. Its fur is light brown and darker around the face, with a pink nose and mouth. The cat's eyes are blue and slanted downward, giving it a perpetually grumpy appearance. The background is blurred, but it appears to be a dark brown color. Overall, the image is a humorous and iconic representation of the popular internet meme character, Grumpy Cat. The cat's facial expression and posture convey a sense of displeasure or annoyance, making it a relatable and entertaining image for many people."
  }
]
```

## REST API

In addition to the Workers AI [binding](https://developers.cloudflare.com/workers-ai/configuration/bindings/), you can use the [REST API](https://developers.cloudflare.com/workers-ai/get-started/rest-api/):

```bash
curl https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/tomarkdown \
  -H 'Authorization: Bearer {API_TOKEN}' \
  -F "files=@cat.jpeg" \
  -F "files=@somatosensory.pdf"
```

## Pricing

`toMarkdown` is free for most format conversions. In some cases, like image conversion, it can use Workers AI models for object detection and summarization, which may incur additional costs if it exceeds the Workers AI free allocation limits. See the [pricing page](https://developers.cloudflare.com/workers-ai/platform/pricing/) for more details.
