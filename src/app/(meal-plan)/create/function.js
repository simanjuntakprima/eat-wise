import { openai } from '@/utils/openai';
import { s3Client } from '@/utils/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export default async function ProcessImagesMeals(mealName) {
  console.log(mealName);
  const mealImagePrompt = `Generate an image prompt for the dish with realistic photo-style, thumbnail quality, slightly blurred edges, low compression detail, e.g., A delicious ${mealName}`;
  const resultImg = await openai.images.generate({
    model: 'gpt-image-1',
    prompt: mealImagePrompt,
    size: 'auto',
  });

  const folder = 'images';
  const key = Date.now() + '.png';
  const buffer = Buffer.from(resultImg.data[0].b64_json, 'base64');
  const path = `https://pub-d4cfcc2a82524ddd85ba0e822aabc5c6.r2.dev/eatwise/images/${key}`;

  try {
    const fileUpload = await s3Client.send(
      new PutObjectCommand({
        Bucket: 'eatwise',
        Key: `${folder}/${key}`,
        Body: buffer,
        ContentType: 'image/png',
      }),
    );
    console.log('File uploaded successfully:', fileUpload);
    console.log('Image URL:', path);
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, message: 'Error uploading image.' };
  }
}
