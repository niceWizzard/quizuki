import * as FileSystem from 'expo-file-system';


const imageCacheDir = FileSystem.documentDirectory + 'images/';

const imageFileUri = () => imageCacheDir + `img_${Date.now()}`;

async function ensureDir() {
    const dirInfo  = await FileSystem.getInfoAsync(imageCacheDir);
    if(!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(imageCacheDir, {intermediates: true});
    }
}

export async function deleteFile(filePath: string) {
    await FileSystem.deleteAsync(filePath, {idempotent: true});
}

export async function downloadImageToCache(imageUrl: string) {
    try {
        await ensureDir();
        const result = await FileSystem.downloadAsync(imageUrl, imageFileUri())
        return result.uri;
    } catch (e) {
        console.error(e);
        return imageUrl;
    }
}