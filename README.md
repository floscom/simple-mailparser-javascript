# Simple Mailparser for JavaScript / NodeJS
MIME-Version 1.0 - MailParser useful for AWS SES Inbound Mails.

The Script is part of an AWS Lambda Project which parse inbound emails and initiate a job which process the text and so on..
The filesize is about ±3.7KiB.

*Info:* the script only parse the content of the mail - not the header!

## How to use
You can include the function directly in your Script no require (NodeJs/AWS Lambda) is necessary.
The function will return a object:

**Mail**
```
{
  text: "TEXT", 
  textCharset: "UTF-8", 
  html: "HTML_TEXT", 
  charsetHtml: "UTF-8", 
  attachments: Array<Attachment>, 
  rawMessage: "RAW_MESSAGE"
}
```
**rawMessage:** For further use, forwarding the mail or anything special, you can use the content of **rawMessage**.

**Attachment**
```
{
  ContentType: "image/png", 
  ContentDisposition: "inline", 
  ContentTransferEncoding: "base64", 
  ContentId: "<ii_1579e151f0c9b0e6>", 
  XAttachmentId: "ii_1579e151f0c9b0e6", 
  name: "image.png",
  data: "..."
}
```

## License
MIT
