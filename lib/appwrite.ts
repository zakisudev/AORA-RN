import {
  Client,
  Account,
  Avatars,
  Databases,
  Storage,
} from 'react-native-appwrite';
import { ID, Query } from 'react-native-appwrite';

export const config = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.zakisu.aora',
  projectId: '66c0c583002586376676',
  databaseId: '66c0c678000251cfdece',
  userCollectionId: '66c0c6bf002dd6b34a5a',
  videoCollectionId: '66c0c6ee002665e0ab83',
  storageId: "66c0c8b0000d9b856ea3"
}

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform)

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Register User
export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, username);

    if (!newAccount) {
      throw new Error('Account not created');
    }

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl
      }
    )

    if (!newUser) {
      throw new Error('User not registered');
    }

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(String(error) ?? 'An error occurred');
  }
}

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailSession(email, password);

    if (!session) {
      throw new Error("Session couldn't be created");
    }

    return session;
  } catch (error) {
    console.log(error);
    throw new Error(String(error) ?? 'An error occurred');
  }
}

export const getAccount = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) {
      throw new Error("No account found or session is invalid.");
    }

    return currentAccount;
  } catch (error) {
    console.error("Failed to fetch account:", error);
    throw new Error("An error has occurred while fetching the account.");
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) {
      throw new Error("No current account found.");
    }

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser.documents || currentUser.documents.length === 0) {
      throw new Error("No user found matching the current account.");
    }

    return currentUser.documents[0];
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    throw new Error("An error has occurred while fetching the current user.");
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc('$createdAt')]
    );

    return posts.documents ?? [];
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw new Error("An error has occurred while fetching the posts.");
  }
}

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt", Query.limit(7))]
    );

    return posts.documents ?? [];
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    throw new Error('An error has occurred while fetching the posts.');
  }
};

export const searchPosts = async (query:string) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.search('title', query)]
    );

    if (!posts) {
      throw new Error('No posts found');
    }

    return posts.documents ?? [];
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    throw new Error('An error has occurred while fetching the posts.');
  }
};

export const getUserPosts = async (userId: any) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal('creater', userId), Query.orderDesc('$createdAt')]
    );

    if (!posts) {
      throw new Error('No posts found');
    }

    return posts.documents ?? [];
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    throw new Error('An error has occurred while fetching the posts.');
  }
};

export const logout = async () => {
  try {
    const session = await account.deleteSession('current');

    if (!session) {
      throw new Error("Couldn't logout");
    }

    return session;
  } catch (error) {
    console.error('Failed to logout:', error);
    throw new Error('An error has occurred while logging out.');
  }
}

export const getFilePreview = async (fileId:string, type:string) => {
  let fileUrl;

  try {
    if (type === 'video') {
      fileUrl = await storage.getFileView(config.storageId, fileId);
    } else if (type === 'image') {
      fileUrl = await storage.getFilePreview(config.storageId, fileId, 2000, 2000, 'top', 100);
    } else {
      throw new Error('Invalid file type');
    }

    if (!fileUrl) {
      throw new Error('No file preview found');
    }

    return fileUrl;
  } catch (error) {
      console.error('Failed to fetch file preview:', error);
      throw new Error('An error has occurred while fetching the file preview.');
    }
  }

export const uploadFile = async (file:any, type:string) => {
  if (!file) return;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri
  };

  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset,
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);

    return fileUrl;
  } catch (error) {
    console.error('Failed to upload file:', error);
    throw new Error('An error has occurred while uploading the file.');
  }
}

export const uploadVideo = async (form:any) => {
  try {
    const [thumbnailUrl, videoUrl]: [{ url: string }, { url: string }] =
      await Promise.all([
        uploadFile(form.thumbnail, 'image'),
        uploadFile(form.video, 'video'),
      ]);

    const newVideo = await databases.createDocument(
      config.databaseId,
      config.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        prompt: form.prompt,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        creater: form.userId
      }
    );

    if (!newVideo) {
      throw new Error('Video not uploaded');
    }

    return newVideo;
  } catch (error) {
    console.error('Failed to upload video:', error);
    throw new Error('An error has occurred while uploading the video.');
  }
}