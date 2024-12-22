const dotenv = require('dotenv');
dotenv.config();

const { REST, Routes } = require('discord.js');

// 新しいコマンド設定
const commands = [
  {
    name: 'remove_access',
    description: 'このコマンドを実行したチャンネルのアクセス権を削除します。これにより、見たくないチャンネルを非表示にすることができます。操作は取り消すことができます。',
    type: 1 // CHAT_INPUTコマンド
  },
  {
    name: 'make_subject',
    description: 'subjectテーブルにデータを登録します。',
    type: 1,
    options: [
      {
        name: 'name',
        description: '登録する名前',
        type: 3, // 文字列
        required: true
      }
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// コマンド登録処理
(async () => {
  try {
    console.log('Started refreshing guild commands.');

    // コマンドを登録（/helloを含めない）
    await rest.put(
      Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('Successfully registered guild commands.');

    // /helloコマンドの削除処理
    const existingCommands = await rest.get(
      Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.GUILD_ID)
    );

    // /helloを削除
    for (const command of existingCommands) {
      if (command.name === 'hello') {
        await rest.delete(
          Routes.applicationGuildCommand(process.env.APPLICATION_ID, process.env.GUILD_ID, command.id)
        );
        console.log(`Successfully deleted command: ${command.name}`);
      }
    }

  } catch (error) {
    console.error('Error refreshing commands:', error);
  }
})();
