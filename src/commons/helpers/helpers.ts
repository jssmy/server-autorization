export class Helper {
    public static fs = require('fs');
    public static privateKey(url: string): string {
        try {
            if (process.env.JWT_PRIVATE_KEY) {
                return process.env.JWT_PRIVATE_KEY;
            }
            return  this.fs.readFileSync(url, 'utf8'); 
        } catch (error) {
            console.log('======>', error);
        }
      }


}