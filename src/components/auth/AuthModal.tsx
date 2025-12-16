// src/components/auth/AuthModal.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import AuthForm, { AuthMode } from "@/components/auth/AuthForm";
import { useI18n } from "@/i18n/I18nProvider";

export default function AuthModal(props: {
  open: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  onSuccess?: () => void;
}) {
  const { open, onClose, initialMode = "signin", onSuccess } = props;

  const { dict } = useI18n();
  const [mode, setMode] = useState<AuthMode>(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, open]);

  const title = useMemo(() => {
    return mode === "signup" ? dict.common.createAccount : dict.common.signIn;
  }, [dict, mode]);

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <AuthForm
        mode={mode}
        setMode={setMode}
        onSuccess={() => {
          onClose();
          onSuccess?.();
        }}
      />
    </Modal>
  );
}
