"use client";

import { useEffect, useState } from "react";
import { ELAPSED_FIELD, HONEYPOT_FIELD } from "@/lib/forms/antispam";

// フォームに差し込む迷惑送信対策の隠しフィールド。実ユーザーには見えず触れない。
// - ハニーポット：画面外に置いた入力欄。bot が埋めたら送信側で破棄する。
// - 滞在秒数：マウント後の経過秒を hidden 値で送る。極端に短い送信を bot 判定する。
export function SpamGuardFields() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        <label>
          このフィールドは入力しないでください
          <input
            type="text"
            name={HONEYPOT_FIELD}
            tabIndex={-1}
            autoComplete="off"
            data-lpignore="true"
            data-1p-ignore="true"
            data-form-type="other"
          />
        </label>
      </div>
      <input type="hidden" name={ELAPSED_FIELD} value={elapsed} readOnly />
    </>
  );
}
