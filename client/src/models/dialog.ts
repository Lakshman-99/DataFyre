export interface CommonDialogProps {
    open: boolean;               // Whether the dialog is visible
    onClose: () => void;         // Function to handle closing the dialog
    onConfirm: () => void;       // Function to handle the confirm action
    question: string;            // The question text to display in the dialog
    info: string;                // Additional information to display in the dialog
    button1: string;             // The label for the first button (e.g., "Cancel")
    button2: string;             // The label for the second button (e.g., "Delete")
}