export function generateNginxConfig(data, path) {
	let config = `
		# 全局配置
		pid ${path}/logs/nginx.pid;
		error_log ${path}/logs/error.log;
		
		# 工作进程配置
		worker_processes auto;
		# 事件模块配置
		events {
			worker_connections 1024;
		}
		
		# HTTP 模块配置
		http {
			# 日志配置
			access_log ${path}/logs/access.log;
		
			include       mime.types;
			default_type  application/octet-stream;
		
			#配置临时文件路径
			client_body_temp_path ${path}/temp/client_body_temp;
			proxy_temp_path ${path}/temp/proxy_temp;
			fastcgi_temp_path ${path}/temp/fastcgi_temp;
			uwsgi_temp_path ${path}/temp/uwsgi_temp;
			scgi_temp_path ${path}/temp/scgi_temp;
		
			# 其他HTTP相关配置
			sendfile        on;
			keepalive_timeout  65;
	`;
	data.forEach(project => {
		config += `
			server {
				listen ${project.port};
				server_name localhost;
			
				location / {
					root ${project.projectPath};
					index index.html;
				}
			`
		project.servers.forEach(server => {
			config += `
				location ${server.rule} {
					proxy_pass ${server.api};
					proxy_set_header Host $host;
					proxy_set_header X-Real-IP $remote_addr;
					proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
					proxy_set_header X-Forwarded-Proto $scheme;
				}
			`;
		});
		config += `
				error_page   500 502 503 504  /50x.html;
				location = /50x.html {
					root   html;
				}
			}
		`
	});
	config += `}`
	return config;
}
