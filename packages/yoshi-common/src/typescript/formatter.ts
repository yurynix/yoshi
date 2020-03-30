// @ts-ignore
import formatter from 'react-dev-utils/typescriptFormatter';
import chalk from 'chalk';

interface ErrorInfo {
  code: number; // error code
  severity: 'error' | 'warning';
  content: string; // message
  file: string; // filePath
  line: number; // line number
  type: 'diagnostic';
  character: number; // column number
  isWarningSeverity: () => boolean;
}

export function formatTypescriptError(errorString: string) {
  const match = errorString.match(
    /(.+\.tsx?)\((\d+),(\d+)\): (\w+) TS(\d+): (.*)/,
  );

  if (!match) {
    return errorString;
  }

  const [, fileName, line, column, severity, code, message] = match;

  const errorInfo: ErrorInfo = {
    type: 'diagnostic',
    severity: severity === 'error' ? 'error' : 'warning',
    file: fileName,
    line: Number(line),
    character: Number(column),
    content: message,
    code: Number(code),
    isWarningSeverity: () => false,
  };

  const errorLocation = chalk.underline(`${fileName}(${line},${column})`);

  return errorLocation + `\n` + formatter(errorInfo, true);
}
