// deployCommands.js (例)
const dotenv = require('dotenv');
dotenv.config();

const { REST, Routes } = require('discord.js');

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// ★ 追加したいコマンド一覧
const commands = [
  {
    name: "remove_access",
    description:
      "このコマンドを実行したチャンネルのアクセス権を削除します。これにより、見たくないチャンネルを非表示にすることができます。操作は取り消すことができます。",
    type: 1, // CHAT_INPUT
  },
  {
    name: "make_subject",
    description: "subjectテーブルにデータを登録します。",
    type: 1,
    options: [
      {
        name: "name",
        description: "登録する名前",
        type: 3, // 文字列
        required: true,
      },
    ],
  },
  {
    name: "make_quiz",
    description: "クイズ作成フローを開始します。",
    type: 1,
    // 今回はオプション無し
  },
  {
    name: "set_view_quiz",
    description: "「回答を見る」ボタンの追加",
    type: 1,
  }
];

/**
 * コマンドを一括上書き (Bulk Overwrite)
 */
(async () => {
  try {
    console.log("Started overwriting guild commands...");

    /**
     * 1) 一旦 guild commands に `commands` のリストを PUT
     *    → これに含まれていないコマンドは自動的に削除
     */
    const newCommands = await rest.put(
      Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log("Successfully registered guild commands:", newCommands);

    // ここで newCommands には登録・更新された最新リストが返ってきます。
    // 以降、不要コマンドが残っているかどうかの確認・削除を行うならこうします:
    //
    // 2) guild コマンド一覧を取得して、もしさらに不要なコマンドがあるなら消す
    //    (通常 Bulk Overwrite で全消しされるので必要ないですが、念のため)
    const existingCommands = await rest.get(
      Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.GUILD_ID)
    );
    console.log("Current guild commands after overwrite:", existingCommands);

    // 念のため確認して、今回指定の `commands` に含まれない名前があれば削除
    for (const cmd of existingCommands) {
      if (!commands.some((c) => c.name === cmd.name)) {
        // ここに来ることは基本的にない想定 (Bulk Overwrite後)
        await rest.delete(
          Routes.applicationGuildCommand(process.env.APPLICATION_ID, process.env.GUILD_ID, cmd.id)
        );
        console.log(`Deleted old command: ${cmd.name}`);
      }
    }

    console.log("All guild commands are now up to date!");
  } catch (error) {
    console.error("Error refreshing commands:", error);
  }
})();
