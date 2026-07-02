const overlay = document.getElementById("confirmOverlay") as HTMLElement;
const messageEl = document.getElementById("confirmMessage") as HTMLElement;
const cancelBtn = document.getElementById("confirmCancelBtn") as HTMLButtonElement;
const deleteBtn = document.getElementById("confirmDeleteBtn") as HTMLButtonElement;


export function confirmDialog(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    messageEl.textContent = message;
    overlay.classList.remove("hidden");
    requestAnimationFrame(() => overlay.classList.add("visible"));

    function cleanup(result: boolean): void {
      overlay.classList.remove("visible");
      setTimeout(() => overlay.classList.add("hidden"), 200);

      cancelBtn.removeEventListener("click", onCancel);
      deleteBtn.removeEventListener("click", onConfirm);
      overlay.removeEventListener("mousedown", onOverlayClick);
      document.removeEventListener("keydown", onKeydown);
      resolve(result);
    }

    function onCancel(): void {
      cleanup(false);
    }

    function onConfirm(): void {
      cleanup(true);
    }

    function onOverlayClick(e: MouseEvent): void {
      if (e.target === overlay) cleanup(false);
    }

    function onKeydown(e: KeyboardEvent): void {
      if (e.key === "Escape") cleanup(false);
    }

    cancelBtn.addEventListener("click", onCancel);
    deleteBtn.addEventListener("click", onConfirm);
    overlay.addEventListener("mousedown", onOverlayClick);
    document.addEventListener("keydown", onKeydown);
  });
}