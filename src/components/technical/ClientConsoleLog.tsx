"use client";

export default function ClientConsoleLog(props: {
  dataToLog: any;
  hide?: boolean;
  name?: string;
}) {
  const { dataToLog, hide, name = "ClientConsoleLog" } = props;
  if (!dataToLog) {
    return null;
  }

  const content = JSON.stringify(dataToLog, null, 2);
  console.log(name, `${content.substring(0, 8)}`, dataToLog);

  return (
    <div>
      <pre>{hide ? null : content}</pre>
    </div>
  );
}
