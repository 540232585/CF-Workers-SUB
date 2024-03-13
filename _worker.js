
// 部署完成后在网址后面加上这个，获取自建节点和机场聚合节点，/?token=auto或/auto或

let mytoken = 'auto'; //可以随便取，或者uuid生成，https://1024tools.com/uuid
let BotToken =''; //可以为空，或者@BotFather中输入/start，/newbot，并关注机器人
let ChatID =''; //可以为空，或者@userinfobot中获取，/start
let TG = 0; //1 为推送所有的访问信息，0 为不推送订阅转换后端的访问信息与异常访问
let SUBUpdateTime = 6; //自定义订阅更新时间，单位小时

//自建节点
const MainData = `
vless://3015a5b2-2187-4a9a-a45b-a880755df548@47.74.54.145:2083?path=%2F540232585.pages.dev%2FproxyIP%3Dproxyip.jp.fxxk.dedyn.io&security=tls&encryption=none&host=fe9b5676-a2aa-4b6a-8257-cd2dd0910205.8c98ef2b-bee2-470b-b759-9f5efbc10812.freeddns.org&fp=random&type=ws&sni=fe9b5676-a2aa-4b6a-8257-cd2dd0910205.8c98ef2b-bee2-470b-b759-9f5efbc10812.freeddns.org#JP+%E5%B7%B2%E5%90%AF%E7%94%A8%E4%B8%B4%E6%97%B6%E5%9F%9F%E5%90%8D%E4%B8%AD%E8%BD%AC%E6%9C%8D%E5%8A%A1%EF%BC%8C%E8%AF%B7%E5%B0%BD%E5%BF%AB%E7%BB%91%E5%AE%9A%E8%87%AA%E5%AE%9A%E4%B9%89%E5%9F%9F%EF%BC%81vless://3015a5b2-2187-4a9a-a45b-a880755df548@47.245.10.156:2083?path=%2F540232585.pages.dev%2FproxyIP%3Dproxyip.jp.fxxk.dedyn.io&security=tls&encryption=none&host=547c921f-c9b1-4d57-bb25-ff5c79749783.a09c5a67-316e-45c6-a051-e6066737fd47.theworkpc.com&fp=random&type=ws&sni=547c921f-c9b1-4d57-bb25-ff5c79749783.a09c5a67-316e-45c6-a051-e6066737fd47.theworkpc.com#JP+%E5%B7%B2%E5%90%AF%E7%94%A8%E4%B8%B4%E6%97%B6%E5%9F%9F%E5%90%8D%E4%B8%AD%E8%BD%AC%E6%9C%8D%E5%8A%A1%EF%BC%8C%E8%AF%B7%E5%B0%BD%E5%BF%AB%E7%BB%91%E5%AE%9A%E8%87%AA%E5%AE%9A%E4%B9%89%E5%9F%9F%EF%BC%81vless://3015a5b2-2187-4a9a-a45b-a880755df548@47.74.54.145:2096?path=%2F540232585.pages.dev%2FproxyIP%3Dproxyip.jp.fxxk.dedyn.io&security=tls&encryption=none&host=68123106-3e43-4958-b75a-b06e81eabf79.50d88e28-a870-497d-bf87-c20fb6802871.camdvr.org&fp=random&type=ws&sni=68123106-3e43-4958-b75a-b06e81eabf79.50d88e28-a870-497d-bf87-c20fb6802871.camdvr.org#JP+%E5%B7%B2%E5%90%AF%E7%94%A8%E4%B8%B4%E6%97%B6%E5%9F%9F%E5%90%8D%E4%B8%AD%E8%BD%AC%E6%9C%8D%E5%8A%A1%EF%BC%8C%E8%AF%B7%E5%B0%BD%E5%BF%AB%E7%BB%91%E5%AE%9A%E8%87%AA%E5%AE%9A%E4%B9%89%E5%9F%9F%EF%BC%81
`

//机场信息，可多个，也可为0
const urls = [
	'https://sub.xf.free.hr/auto',
	'https://hy2sub.pages.dev',
	// 添加更多订阅,支持base64
];

let subconverter = "api.v1.mk"; //在线订阅转换后端，目前使用肥羊的订阅转换功能。支持自建psub 可自行搭建https://github.com/bulianglin/psub
let subconfig = "https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online_Full.ini"; //订阅配置文件

export default {
	async fetch (request,env) {
		const userAgentHeader = request.headers.get('User-Agent');
		const userAgent = userAgentHeader ? userAgentHeader.toLowerCase() : "null";
		const url = new URL(request.url);
		const token = url.searchParams.get('token');
		mytoken = env.TOKEN || mytoken;
		BotToken = env.TGTOKEN || BotToken;
		ChatID = env.TGID || ChatID; 
		TG =  env.TG || TG; 
		subconverter = env.SUBAPI || subconverter;
		subconfig = env.SUBCONFIG || subconfig;

		if ( !(token == mytoken || url.pathname == ("/"+ mytoken) || url.pathname.includes("/"+ mytoken + "?")) ) {
			if ( TG == 1 && url.pathname !== "/" && url.pathname !== "/favicon.ico" ) await sendMessage("#异常访问", request.headers.get('CF-Connecting-IP'), `UA: ${userAgent}</tg-spoiler>\n域名: ${url.hostname}\n<tg-spoiler>入口: ${url.pathname + url.search}</tg-spoiler>`);
			return new Response('Hello World!', { status: 403 });
		} else if ( TG == 1 || !userAgent.includes('subconverter') ){
			await sendMessage("#获取订阅", request.headers.get('CF-Connecting-IP'), `UA: ${userAgent}</tg-spoiler>\n域名: ${url.hostname}\n<tg-spoiler>入口: ${url.pathname + url.search}</tg-spoiler>`);
		}

		if (userAgent.includes('clash')) {
			const subconverterUrl = `https://${subconverter}/sub?target=clash&url=${encodeURIComponent(request.url)}&insert=false&config=${encodeURIComponent(subconfig)}&emoji=true&list=false&tfo=false&scv=false&fdn=false&sort=false&new_name=true`;

			try {
				const subconverterResponse = await fetch(subconverterUrl);
				
				if (!subconverterResponse.ok) {
					throw new Error(`Error fetching subconverterUrl: ${subconverterResponse.status} ${subconverterResponse.statusText}`);
				}
				
				const subconverterContent = await subconverterResponse.text();
				
				return new Response(subconverterContent ,{
					headers: { 
						"content-type": "text/plain; charset=utf-8",
						"Profile-Update-Interval": `${SUBUpdateTime}`,
					}
				});
			} catch (error) {
				return new Response(`Error: ${error.message}`, {
					status: 500,
					headers: { 'content-type': 'text/plain; charset=utf-8' },
				});
			}
		} else if (userAgent.includes('sing-box') || userAgent.includes('singbox')) {
			const subconverterUrl = `https://${subconverter}/sub?target=singbox&url=${encodeURIComponent(request.url)}&insert=false&config=${encodeURIComponent(subconfig)}&emoji=true&list=false&tfo=false&scv=false&fdn=false&sort=false&new_name=true`;

			try {
				const subconverterResponse = await fetch(subconverterUrl);
				
				if (!subconverterResponse.ok) {
					throw new Error(`Error fetching subconverterUrl: ${subconverterResponse.status} ${subconverterResponse.statusText}`);
				}
				
				const subconverterContent = await subconverterResponse.text();
				
				return new Response(subconverterContent ,{
					headers: { 
						"content-type": "text/plain; charset=utf-8",
						"Profile-Update-Interval": `${SUBUpdateTime}`,
					}
				});
			} catch (error) {
				return new Response(`Error: ${error.message}`, {
					status: 500,
					headers: { 'content-type': 'text/plain; charset=utf-8' },
				});
			}
		} else {
			let req_data = "";
			req_data += MainData;
			
			try {
				const responses = await Promise.all(urls.map(url => fetch(url,{
					method: 'get',
					headers: {
						'Accept': 'text/html,application/xhtml+xml,application/xml;',
						'User-Agent': 'CF-Workers-SUB/cmliu'
					}
				})));
					
				for (const response of responses) {
					if (response.ok) {
						const content = await response.text();
						req_data += atob(content) + '\n';
					}
				}
			} catch (error) {
	
			}
			//修复中文错误
			const utf8Encoder = new TextEncoder();
			const encodedData = utf8Encoder.encode(req_data);
			const text = String.fromCharCode.apply(null, encodedData);

			//去重
			const uniqueLines = new Set(text.split('\n'));
			const result = [...uniqueLines].join('\n');
			//console.log(result);

			const base64Data = btoa(result);
			return new Response(base64Data ,{
				headers: { 
					"content-type": "text/plain; charset=utf-8",
					"Profile-Update-Interval": `${SUBUpdateTime}`,
				}
			});
		}
	}
};

async function sendMessage(type, ip, add_data = "") {
	if ( BotToken !== '' && ChatID !== ''){
		let msg = "";
		const response = await fetch(`http://ip-api.com/json/${ip}?lang=zh-CN`);
		if (response.status == 200) {
			const ipInfo = await response.json();
			msg = `${type}\nIP: ${ip}\n国家: ${ipInfo.country}\n<tg-spoiler>城市: ${ipInfo.city}\n组织: ${ipInfo.org}\nASN: ${ipInfo.as}\n${add_data}`;
		} else {
			msg = `${type}\nIP: ${ip}\n<tg-spoiler>${add_data}`;
		}
	
		let url = "https://api.telegram.org/bot"+ BotToken +"/sendMessage?chat_id=" + ChatID + "&parse_mode=HTML&text=" + encodeURIComponent(msg);
		return fetch(url, {
			method: 'get',
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;',
				'Accept-Encoding': 'gzip, deflate, br',
				'User-Agent': 'Mozilla/5.0 Chrome/90.0.4430.72'
			}
		});
	}
}
