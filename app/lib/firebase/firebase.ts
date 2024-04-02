import { env } from '@/app/lib/enviroment'
import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import { FirebaseStorage, getBytes, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

const firebaseConfig: FirebaseOptions = env.FIREBASE_CONFIG;

export class FirebaseGateway {
  private _app: FirebaseApp
  private _storage: FirebaseStorage

  constructor() {
      this._app = initializeApp(firebaseConfig);
      this._storage = getStorage(this._app);
  }

  async uploadFile(input: { buffer: Buffer, name: string, type: string }): Promise<string> {
      const { buffer, name, type } = input

      const fileRef = ref(this._storage, `bota/upload-files/${name}`);

      const fileUrl = await uploadBytes(
          fileRef,
          buffer,
          { contentType: type }
      ).then(
          async (snapshot) => {
              const url = await getDownloadURL(snapshot.ref).then((url) => url);
              return url;
          }
      );

      return fileUrl;
  };

  async downloadFile(input: { bucket: string }) {
      const { bucket } = input
      const fileRef = ref(this._storage, bucket);
      return await getBytes(fileRef)
  }
}
