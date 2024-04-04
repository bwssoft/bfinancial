import { env } from "@/app/lib/enviroment";
import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
import {
  FirebaseStorage,
  UploadResult,
  getBytes,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";

const firebaseConfig: FirebaseOptions = env.FIREBASE_CONFIG;

class FirebaseGateway {
  private _app: FirebaseApp;
  private _storage: FirebaseStorage;

  constructor() {
    this._app = initializeApp(firebaseConfig);
    this._storage = getStorage(this._app);
  }

  async uploadFile(input: { buffer: Buffer; name: string; type: string }): Promise<string> {
    const { buffer, name, type } = input;

    const fileRef = ref(this._storage, `b-financial/qr-codes/${name}`);

    const fileUrl: UploadResult = await uploadBytes(fileRef, buffer, { contentType: type });

    const url = await getDownloadURL(fileUrl.ref).then((url) => url);

    return url;
  }

  async downloadFile(input: { bucket: string }) {
    const { bucket } = input;
    const fileRef = ref(this._storage, bucket);
    return await getBytes(fileRef);
  }
}

const firebaseGateway = new FirebaseGateway();

export { firebaseGateway as FirebaseGateway };
