import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { serverEnv } from "./env";

function initFirebaseAdmin() {
    const apps = getApps();

    if (!apps.length) {
        if (!serverEnv.FIREBASE_PROJECT_ID || !serverEnv.FIREBASE_PRIVATE_KEY || !serverEnv.FIREBASE_CLIENT_EMAIL) {
            console.error("❌ [Firebase Admin] Missing credentials! Firestore Admin operations will fail.");
        } else {
            try {
                const formattedKey = serverEnv.FIREBASE_PRIVATE_KEY.includes('\\n')
                    ? serverEnv.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
                    : serverEnv.FIREBASE_PRIVATE_KEY;

                initializeApp({
                    credential: cert({
                        projectId: serverEnv.FIREBASE_PROJECT_ID,
                        clientEmail: serverEnv.FIREBASE_CLIENT_EMAIL,
                        privateKey: formattedKey,
                    }),
                });
                console.log("✅ [Firebase Admin] Initialized Successfully.");
            } catch (error) {
                console.error("❌ [Firebase Admin] Initialization Failed:", error);
            }
        }
    }

    const db = getFirestore();
    db.settings({ ignoreUndefinedProperties: true });

    return {
        auth: getAuth(),
        db,
    };
}

export const { auth: adminAuth, db: adminDb } = initFirebaseAdmin();
