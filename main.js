// app 模块，它控制应用程序的事件生命周期。
// BrowserWindow 模块，它创建和管理应用程序 窗口。
const { app, BrowserWindow, ipcMain, Menu, dialog, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const sudo = require('sudo-prompt');

const is_dev = app.isPackaged !== true;
const createWindow = () => {
    // 取消菜单栏
    Menu.setApplicationMenu(null) // null值取消顶部菜单栏
    // 创建一个浏览器窗口对象
    const win = new BrowserWindow({
        width: 1360,
        height: 768,
        resizable: false,
        title: "Web Deploy",
        icon: path.join(__dirname, 'public', 'favicon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js'),
        },
        autoHideMenuBar: true,
        center: true,
    })

    if (is_dev) {
        win.loadURL('http://localhost:5173/')
    } else {
        win.loadFile(path.join(__dirname, 'dist', 'index.html'))
    }
};

/** 获取路径*/
const getFilePath = (filePath) => {
    if (path.isAbsolute(filePath)) {
        return filePath
    } else {
        if (is_dev) {
            return path.join(__dirname,'public/config', filePath)
        } else {
            return path.join(process.resourcesPath, 'config', filePath)
        }
    }
};
/** 创建所需的目录*/
const ensureDirectories = (basePath) => {
    const requiredDirs = [
        // path.join(basePath, 'logs', 'error.log'),
        path.join(basePath, 'temp', 'client_body_temp'),
        path.join(basePath, 'temp', 'proxy_temp'),
        path.join(basePath, 'temp', 'fastcgi_temp'),
        path.join(basePath, 'temp', 'uwsgi_temp'),
        path.join(basePath, 'temp', 'scgi_temp')
    ];

    requiredDirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`0.Created missing directory: ${dir}`);
        }
    });
};

// 显式设置应用程序名称
const options = {
    name: 'webDeploy',
};

/** app模块准备完成，创建窗口*/
app.whenReady().then(() => {
    ipcMain.handle('__dirname', () => __dirname)
    createWindow()
});

/** 获取文件路径*/
ipcMain.handle('select-file', async (event, ...args) => {
    return await dialog.showOpenDialog({
        properties: ['openDirectory'],
    });
});

/** 监听文件读*/
ipcMain.on('read-file', (event, filePath) => {
    const resolvedPath = getFilePath(filePath);
    fs.readFile(resolvedPath, 'utf-8', (err, data) => {
        if (err) {
            event.reply('read-file-response', { success: false, content: null, msg: err.toString() });
        } else {
            event.reply('read-file-response', { success: true, content: data });
        }
    });
});

/** 监听文件写*/
ipcMain.on('write-file', (event, filePath, content) => {
    const resolvedPath = getFilePath(filePath);
    fs.writeFile(resolvedPath, content, (err) => {
        if (err) {
            event.reply('write-file-response', { success: false, msg: err.toString() });
        } else {
            event.reply('write-file-response', { success: true });
        }
    });
});

/** 监听获取路径下所有文件名称*/
ipcMain.on('get-directory', (event, filePath) => {
    const resolvedPath = getFilePath(filePath);
    fs.readdir(resolvedPath, (err, files) => {
        if (err) {
            event.reply('get-directory-response', { success: false, msg: err.toString() });
        } else {
            event.reply('get-directory-response', { success: true, content: files });
        }
    });
});

/** 监听请求启动nginx*/
ipcMain.on('start-nginx', (event, filePath) => {
    const resolvedPath = path.join(filePath, 'nginx.exe');
    const nginxConfPath = path.join(filePath, 'conf', 'nginx.conf');
    const command = `"${resolvedPath}" -c ${nginxConfPath}`;
    ensureDirectories(filePath);
    sudo.exec(command, options, (err, stdout, stderr) => {
        if (err || stderr) {
            event.reply('start-nginx-response', { success: false, msg: (err ? err.toString() : '') + (stderr ? stderr.toString() : '') });
        } else {
            event.reply('start-nginx-response', { success: true });
        }
    });
});

/** 配置入栈规则*/
ipcMain.on('inbound-rules', (event, name, port) => {
    const command = `netsh advfirewall firewall add rule name=${name} dir=in action=allow protocol=TCP localport=${port}`;
    sudo.exec(command, options, (err, stdout, stderr) => {
        if (err || stderr) {
            event.reply('inbound-rules-response', { success: false, msg: err.toString() });
        } else {
            event.reply('inbound-rules-response', { success: true });
        }
    })
});

/** 打开浏览器*/
ipcMain.on('click-link', (event, url) => {
    shell.openExternal(url).then(() => {
        event.reply('click-link-response', { success: true});
    }).catch(err => {
        event.reply('click-link-response', { success: false, msg: err.toString() });
    })
});
