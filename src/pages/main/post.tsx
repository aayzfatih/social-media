import { Post as IPost } from "./main";
import {
  addDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";

interface Props {
  post: IPost;
}
interface Like {
  likeId: string;
  userId: string;
}
export const Post = (props: Props) => {
  const { post } = props;

  const likesRef = collection(db, "likes");

  const [user] = useAuthState(auth);

  const likesDocs = query(likesRef, where("postId", "==", post.id));

  const [likes, setLikes] = useState<Like[] | null>(null);

  const getLikes = async () => {
    const data = await getDocs(likesDocs);
    setLikes(
      data.docs.map((doc) => ({
        userId: doc.data().userId,
        likeId: doc.data().likeId,
      }))
    );
  };
  const addLike = async () => {
    try {
      const newDoc = await addDoc(likesRef, {
        userId: user?.uid,
        postId: post.id,
      });
      if (user) {
        setLikes((prev) =>
          prev
            ? [...prev, { userId: user.uid, likeId: newDoc.id }]
            : [{ userId: user.uid, likeId: newDoc.id }]
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  const removeLike = async () => {
    try {
      const likeToDeleteQuery = query(
        likesRef,
        where("postId", "==", post.id),
        where("userId", "==", user?.uid)
      );
      const likeToDeleteData = await getDocs(likeToDeleteQuery);
      const likeId = likeToDeleteData.docs[0].id;
      const likeToDelete = doc(db, "likes", likeId);
      await deleteDoc(likeToDelete);
      if (user) {
        setLikes(
          (prev) => prev && prev?.filter((like) => like.likeId !== likeId)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  const hasUserLiked = likes?.find((like) => like.userId === user?.uid);
  useEffect(() => {
    getLikes();
  }, []);
  return (
    <section>
      <div className="py-16 flex flex-col items-center justify-center">
        <div className="mx-auto px-6 max-w-6xl text-gray-500 ">
          <div className="mt-12">
            <div className="relative size-full group overflow-hidden p-8 rounded-xl bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
              <div
                aria-hidden="true"
                className="inset-0 absolute aspect-video border rounded-full -translate-y-1/2 group-hover:-translate-y-1/4 duration-300 bg-gradient-to-b from-blue-500 to-white dark:from-white dark:to-white blur-2xl opacity-25 dark:opacity-5 dark:group-hover:opacity-10"
              ></div>
              <div className="relative">
                <div className="border border-blue-500/10 flex relative *:relative  *:m-auto size-1/2 rounded-lg dark:bg-gray-900 dark:border-white/15 before:rounded-[7px] before:absolute before:inset-0 before:border-t before:border-white before:from-blue-100 dark:before:border-white/20 before:bg-gradient-to-b dark:before:from-white/10 dark:before:to-transparent before:shadow dark:before:shadow-gray-950">
                  <h1 className="font-bold">{post.title}</h1>
                </div>

                <div className="mt-6 pb-6 rounded-b-[--card-border-radius]">
                  <p className="text-gray-700 dark:text-gray-300">
                    {post.description}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center gap-3 -mb-8 py-4 border-t border-gray-200 dark:border-gray-800">
                  <p className="group flex items-center rounded-xl size-1/3 p-2 disabled:border *:select-none [&>*:not(.sr-only)]:relative *:disabled:opacity-20 disabled:text-gray-950 disabled:border-gray-200 disabled:bg-gray-100 dark:disabled:border-gray-800/50 disabled:dark:bg-gray-900 dark:*:disabled:!text-white text-gray-950 bg-gray-100 hover:bg-gray-200/75 active:bg-gray-100 dark:text-white dark:bg-gray-500/10 dark:hover:bg-gray-500/15 dark:active:bg-gray-500/10  justify-center">
                    @{post.username}
                  </p>
                  <div className="flex flex-row gap-2">
                    <button
                      onClick={hasUserLiked ? removeLike : addLike}
                      className="group rounded-xl disabled:border p-2 *:select-none [&>*:not(.sr-only)]:relative *:disabled:opacity-20 disabled:text-gray-950 disabled:border-gray-200 disabled:bg-gray-100 dark:disabled:border-gray-800/50 disabled:dark:bg-gray-900 dark:*:disabled:!text-white text-gray-950 bg-gray-100 hover:bg-gray-200/75 active:bg-gray-100 dark:text-white dark:bg-gray-500/10 dark:hover:bg-gray-500/15 dark:active:bg-gray-500/10 flex gap-1.5 items-center text-sm h-8 px-3.5 justify-center"
                    >
                      {hasUserLiked ? <>&#128078;</> : <>&#128077;</>}
                    </button>
                    {likes && <p>Like:{likes?.length}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
