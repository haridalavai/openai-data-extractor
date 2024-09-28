import { ChatCompletionMessageParam } from "openai/src/resources/index.js";

export const prepareFileExtractionPrompt = async (
  file: File
): Promise<ChatCompletionMessageParam[]> => {
  console.log(file.type);
  switch (file.type) {
    case "image/jpg":
    case "image/jpeg":
    case "image/png":
    case "image/gif":
    case "image/bmp":
    case "image/svg":
    case "image/webp":
    case "image/tiff":
    case "image/ico":
      const image_url = await extractImageURL(file);
      return getBasePromptFile(image_url, "image");
    // case "application/pdf":
    //   const pdf_image_buffer = await convertPDFToImageBuffer(file);
    //   const pdf_image = `data:image/png;base64,${pdf_image_buffer.toString("base64")}`;
    //   return getBasePromptFile(pdf_image, "image");
    default:
      return [];
  }
};

const getBasePromptFile = (
  context: string,
  contextType: string
): ChatCompletionMessageParam[] => {
  const BASE_PROMPT = `You are an AI assistant who can extract data from images. 
            You are given an image file or text content of a Purchase Order. 
            You need to extract PO number(Purchase Order Number).
            and item name, quantity and price of each item in the PO.
            response should be only in valid JSON format. Do no include any thing else in the response.
            example response:
            result: {po_number: "123456", items: [{name: "item1", quantity: 1, price: 100}, {name: "item2", quantity: 2, price: 200}]}`;

  const content: ChatCompletionMessageParam[] = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: BASE_PROMPT,
        },
        {
          type: "image_url",
          image_url: {
            url: contextType === "image" ? context : "",
          },
        },
        {
          type: "text",
          text: contextType === "text" ? context : "",
        },
      ],
    },
  ];

  return content;
};

export const extractImageURL = async (file: File): Promise<string> => {
  return `data:image/png;base64,${Buffer.from(
    await file.arrayBuffer()
  ).toString("base64")}`;
};