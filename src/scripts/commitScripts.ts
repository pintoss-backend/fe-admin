/* eslint-disable no-console */

import { exec, execSync } from "child_process";
import inquirer from "inquirer";

const keywords = [
  {
    name: "✨ feat - 새로운 기능 추가",
    value: "✨ feat",
  },
  {
    name: "🔧 fix - 버그 수정 및 개선",
    value: "🔧 fix",
  },
  {
    name: "⚡ hotfix - 긴급 버그 수정",
    value: "⚡ hotfix",
  },
  {
    name: "📝 docs - 문서 수정 및 추가",
    value: "📝 docs",
  },
  {
    name: "💄 style - 코드 의미에 영향을 주지 않는 변경사항(코드 포맷팅, 세미콜론 누락 등)",
    value: "💄 style",
  },
  {
    name: "🔨 refactor - 코드 리팩토링(사용하지 않거나 중복된 코드를 정리)",
    value: "🔨 refactor",
  },
  {
    name: "📦 chore - 빌드 부분 혹은 패키지 매니저 수정 사항(예:.gitignore 수정)",
    value: "📦 chore",
  },
  {
    name: "🚀 init - 프로젝트 초기 설정",
    value: "🚀 init",
  },
];

// 브랜치에서 #숫자 추출
function getIssueNumberFromBranch(): string | null {
  try {
    const branchName = execSync("git rev-parse --abbrev-ref HEAD")
      .toString()
      .trim();
    const match = branchName.match(/#(\d+)/); // # 뒤 숫자만 추출
    return match && match[1] ? match[1] : null;
  } catch {
    return null;
  }
}

// 이슈 번호 가져오기 (브랜치 자동 + 사용자 입력 보완)
async function getIssueNumberOrPrompt(): Promise<string | null> {
  const branchIssue = getIssueNumberFromBranch();
  if (branchIssue) return branchIssue;

  const { issueNumber } = await inquirer.prompt({
    type: "input",
    name: "issueNumber",
    message: "이슈 번호를 입력하세요 (없으면 엔터):",
    validate: (input: string) => {
      if (input.trim() && !/^\d+$/.test(input.trim())) {
        return "숫자만 입력해주세요.";
      }
      return true;
    },
  });

  return issueNumber.trim() || null;
}

async function runCommitScript() {
  exec("git diff --cached --name-only", async (error, stdout) => {
    if (error) {
      console.error("Git 상태 확인 실패:", error.message);
      return;
    }

    if (!stdout.trim()) {
      console.log("커밋할 변경사항이 없습니다.");
      return;
    }

    const issueNumber = await getIssueNumberOrPrompt();

    const { selectedKeyword } = await inquirer.prompt({
      type: "list",
      name: "selectedKeyword",
      message: "커밋 키워드를 선택하세요:",
      choices: keywords,
    });

    const { commitMessage } = await inquirer.prompt({
      type: "input",
      name: "commitMessage",
      message: "커밋 메시지를 입력하세요:",
      validate: (input: string) => {
        if (!input.trim()) return "커밋 메시지를 입력해주세요.";
        return true;
      },
    });

    const issuePrefix = issueNumber ? `#${issueNumber} ` : "";
    const fullCommitMessage = `${issuePrefix}${selectedKeyword}: ${commitMessage}`;

    exec(`git commit -m "${fullCommitMessage}"`, (error, stdout, stderr) => {
      if (error || stderr) {
        console.error("커밋 실패:", error?.message || stderr);
        return;
      }
      if (stdout) console.log("커밋 성공:", stdout.trim());
    });
  });
}

runCommitScript();
