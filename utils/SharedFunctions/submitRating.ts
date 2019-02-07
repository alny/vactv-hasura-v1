import { toast } from "react-toastify";

export const submitRate = async (rateClip, state, closeModal) => {
  const notifySuccess = () => toast.success("😄 Rating submitted!");
  const notifyError = () => toast.error("🤔 Already rated!");

  if (state) {
    try {
      const { data } = await rateClip();

      if (data.insert_rating) {
        notifySuccess();
        closeModal();
      } else {
        notifyError();
        // closeModal();
        console.log("Already rated 🤔");
      }
    } catch (error) {
      notifyError();
      closeModal();
      console.log(error);
      return;
    }
  }
};
