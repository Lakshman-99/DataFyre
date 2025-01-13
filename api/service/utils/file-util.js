import fs from "fs";
import path from "path"

/**
 * Ensures the directory exists, copies the file, and optionally deletes the source file.
 * @param {string} src - The source file path.
 * @param {string} des - The destination file path.
 * @param {boolean} [cleanup=true] - Whether to delete the source file after copying.
 */
const createAndCopyFile = async (src, des, cleanup = true) => {
    try {
        // Ensure the target directory exists
        await fs.promises.mkdir(path.dirname(des), { recursive: true });

        // Copy the file to the target location
        await fs.promises.copyFile(src, des);
        console.log(`File copied from ${src} to ${des}`);

        // Cleanup: Delete the source file if requested
        if (cleanup) {
            await fs.promises.unlink(src);
            console.log(`Source file ${src} deleted after copying.`);
        }
    } catch (err) {
        console.error('Error handling file:', err);
    }
};

export default createAndCopyFile ;