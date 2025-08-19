/* eslint-disable no-console */

import { exec } from "child_process";
import inquirer from "inquirer";

const keywords = [
  {
    name: "✨ feat - 새로운 기능 추가",
    value: "✨ feat",
  },
  {
    name: "🔧 fix - 버그 수정 및 개선선",
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

async function runCommitScript() {
  // 스테이징된 파일만 확인
  exec("git diff --cached --name-only", async (error, stdout) => {
    if (error) {
      console.error("Git 상태 확인 실패:", error.message);
      return;
    }

    if (!stdout.trim()) {
      console.log("커밋할 변경사항이 없습니다.");
      return;
    }

    // 이슈 번호 입력 프롬프트
    const { issueNumber } = await inquirer.prompt({
      type: "input",
      name: "issueNumber",
      message: "이슈 번호를 입력하세요 (예: 123, 없으면 엔터):",
      validate: (input: string) => {
        if (input.trim() && !/^\d+$/.test(input.trim())) {
          return "숫자만 입력해주세요.";
        }
        return true;
      },
    });

    // 키워드 선택 프롬프트
    const { selectedKeyword } = await inquirer.prompt({
      type: "list",
      name: "selectedKeyword",
      message: "커밋 키워드를 선택하세요:",
      choices: keywords,
    });

    // 커밋 메시지 입력 프롬프트
    const { commitMessage } = await inquirer.prompt({
      type: "input",
      name: "commitMessage",
      message: "커밋 메시지를 입력하세요:",
      validate: (input: string) => {
        if (!input.trim()) return "커밋 메시지를 입력해주세요.";
        return true;
      },
    });

    // 최종 메시지 구성
    const issuePrefix = issueNumber.trim() ? `#${issueNumber.trim()} ` : "";
    const fullCommitMessage = `${issuePrefix}${selectedKeyword}: ${commitMessage}`;

    exec(`git commit -m "${fullCommitMessage}"`, (error, stdout, stderr) => {
      if (error || stderr) {
        console.error("커밋 실패:", error?.message || stderr);
        return;
      }
      if (stdout) {
        console.log("커밋 성공:", stdout.trim());
      }
    });
  });
}

runCommitScript();
