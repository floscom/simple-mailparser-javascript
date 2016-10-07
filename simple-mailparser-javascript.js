const regexBoundary = /Content-Type: multipart\/([a-z]+); boundary=(.*)/g;
const regexContentType = /Content-Type:\s([a-zA-Z0-9\/=+]+);\scharset=([a-zA-Z0-9\/=+-]+)/g;
const regexContentTransferEncoding = /Content-Transfer-Encoding:\s([a-zA-Z0-9\/=+]+)/g;

const regexContentTypeAttachment = /Content-Type:\s([a-zA-z\/]+);\sname="(.*)"/g;
const regexContentDisposition = /Content-Disposition:\s([a-zA-z\/]+);\sfilename="(.*)"/g;
const regexContentAttachmentTransferEncoding = /Content-Transfer-Encoding:\s([a-zA-z\/0-9]+)/g;
const regexContentId = /Content-ID:\s(.*)/g;
const regexXAttachmentId = /X-Attachment-Id:\s(.*)/g;

function codeline_MailParser(data) {

	var parsing = false;

	var charsetText = "";
	var dataText = "";
	var charsetHtml = "";
	var dataHtml = "";

	var boundary = "";
	var boundaries = [];

	var attachments = []
	var rawMessage = [];

	var tmp_ContentTypeAttachment = "";
	var tmp_ContentDisposition = "";
	var tmp_ContentAttachmentTransferEncoding = "";
	var tmp_ContentId = "";
	var tmp_XAttachmentId = "";
	var tmp_filename = "";
	var tmp_data = "";

	data.toString().split("\n").forEach(function(line) {

		if(line.match(regexBoundary)) {
			boundaryTmp = regexBoundary.exec(line);
			boundary = boundaryTmp[2];
			boundaries.push("--" + boundary+"\r");
			boundaries.push("--" + boundary + "--\r");
			rawMessage.push(line);
			return;
		}

		if(boundaries.indexOf(line) > -1) {
			if(line.substr(line.length-3, 2) == "--") {
				if(tmp_data != "") {
					newAttachment = {};
					newAttachment.ContentType = tmp_ContentTypeAttachment;
					newAttachment.ContentDisposition = tmp_ContentDisposition;
					newAttachment.ContentTransferEncoding = tmp_ContentAttachmentTransferEncoding;
					newAttachment.ContentId = tmp_ContentId;
					newAttachment.XAttachmentId = tmp_XAttachmentId;
					newAttachment.name = tmp_filename;
					newAttachment.data = tmp_data;
					attachments.push(newAttachment);

					tmp_ContentTypeAttachment = "";
					tmp_ContentDisposition = "";
					tmp_ContentAttachmentTransferEncoding = "";
					tmp_ContentId = "";
					tmp_XAttachmentId = "";
					tmp_filename = "";
					tmp_data = "";
				}
				parsing = false;
			} else {
				parsing = true;
			}
			rawMessage.push(line);
			return;
		}

		if(rawMessage.length > 0) rawMessage.push(line);

		if(parsing) {

			if(line.match(regexContentType)) {
				regEx = regexContentType.exec(line);
				parsing = regEx[1];
				if(parsing == "text/plain") charsetText = regEx[2];
				if(parsing == "text/html") charsetHtml = regEx[2];
				return;
			}
			
			if(parsing == "text/plain") {
				dataText += line + "\n";
			} else if(parsing == "text/html") {
				dataHtml += line + "\n" ;
			} else {
				if(line != "\r") {
					if(line.match(regexContentTypeAttachment)) {
						tmp = regexContentTypeAttachment.exec(line);
						tmp_ContentTypeAttachment = tmp[1];
						tmp_filename = tmp[2];
						return;
					}
					if(line.match(regexContentDisposition)) {
						tmp = regexContentDisposition.exec(line);
						tmp_ContentDisposition = tmp[1];
						tmp_filename = tmp[2];
						return;
					}
					if(line.match(regexContentAttachmentTransferEncoding)) {
						tmp = regexContentAttachmentTransferEncoding.exec(line);
						tmp_ContentAttachmentTransferEncoding = tmp[1];
						return;
					}
					if(line.match(regexContentId)) {
						tmp = regexContentId.exec(line);
						tmp_ContentId = tmp[1];
						return;
					}
					if(line.match(regexXAttachmentId)) {
						tmp = regexXAttachmentId.exec(line);
						tmp_XAttachmentId = tmp[1];
						return;
					}
					tmp_data += line.replace("\r", "");
				}
			}

		}

	});

	return {text: dataText, textCharset: charsetText, html: dataHtml, charsetHtml: charsetHtml, attachments: attachments, rawMessage: rawMessage.join("\n")};

}
