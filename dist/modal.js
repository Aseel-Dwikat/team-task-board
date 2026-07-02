const overlay = document.getElementById("confirmOverlay");
const messageEl = document.getElementById("confirmMessage");
const cancelBtn = document.getElementById("confirmCancelBtn");
const deleteBtn = document.getElementById("confirmDeleteBtn");
export function confirmDialog(message) {
    return new Promise((resolve) => {
        messageEl.textContent = message;
        overlay.classList.remove("hidden");
        requestAnimationFrame(() => overlay.classList.add("visible"));
        function cleanup(result) {
            overlay.classList.remove("visible");
            setTimeout(() => overlay.classList.add("hidden"), 200);
            cancelBtn.removeEventListener("click", onCancel);
            deleteBtn.removeEventListener("click", onConfirm);
            overlay.removeEventListener("mousedown", onOverlayClick);
            document.removeEventListener("keydown", onKeydown);
            resolve(result);
        }
        function onCancel() {
            cleanup(false);
        }
        function onConfirm() {
            cleanup(true);
        }
        function onOverlayClick(e) {
            if (e.target === overlay)
                cleanup(false);
        }
        function onKeydown(e) {
            if (e.key === "Escape")
                cleanup(false);
        }
        cancelBtn.addEventListener("click", onCancel);
        deleteBtn.addEventListener("click", onConfirm);
        overlay.addEventListener("mousedown", onOverlayClick);
        document.addEventListener("keydown", onKeydown);
    });
}
//# sourceMappingURL=modal.js.map