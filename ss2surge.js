function decodeScheme(url) {
    let method, password, hostname, port, plugin, tag
    if (!url.includes('#')) {
        url += '#Unnamed'
    }
    tag = $text.URLDecode(url.match(/#(.*?)$/)[1])
    if (url.includes('?')) {
        // tag = $text.URLDecode(url.match(/#(.*?)$/)[1])
        let mdps = url.match(/ss:\/\/(.*?)@/)[1]
        let padding = 4 - mdps.length % 4
        if (padding < 4) {
            mdps += Array(padding + 1).join('=')
        }
        let userinfo = $text.base64Decode(mdps)
        method = userinfo.split(':')[0]
        password = userinfo.split(':')[1]
        let htpr = url.match(/@(.*?)\?/)[1].replace('\/', '')
        hostname = htpr.split(':')[0]
        port = htpr.split(':')[1]
        let ps = $text.URLDecode(url.match(/\?(.*?)#/)[1])
        let obfs = ps.match(/obfs=(.*?);/)[1]
        let obfsHost = ps.match(/obfs-host=(.*?)$/)[1]
        plugin = `obfs=${obfs}, obfs-host=${obfsHost}`
    } else {
        let mdps = url.match(/ss:\/\/(.*?)#/)[1]
        let padding = 4 - mdps.length % 4
        if (padding < 4) {
            mdps += Array(padding + 1).join('=')
        }
        [method, password, hostname, port] = $text.base64Decode(mdps).split(/[:,@]/)
    }
    let proxy = `${tag} = custom, ${hostname}, ${port}, ${method}, ${password}, http://omgib13x8.bkt.clouddn.com/SSEncrypt.module`
    if (plugin != undefined) {
        proxy += `, ${plugin}`
    }
    return proxy
}

$ui.menu({
    items: ['剪贴板读取链接', '扫描二维码'],
    handler: function(title, idx) {
        let result
        if (idx == 0) {
            result = decodeScheme($clipboard.text)
            $ui.alert({
                title: "转换结果",
                message: result,
                actions: [{
                    title: 'Cancel'
                }, {
                    title: 'Copy',
                    handler: () => {
                        $clipboard.text = result
                    }
                }]
            })
        } else {
            $qrcode.scan({
                handler(string) {
                    result = decodeScheme(string)
                    $ui.alert({
                        title: "转换结果",
                        message: result,
                        actions: [{
                            title: 'Cancel'
                        }, {
                            title: 'Copy',
                            handler: () => {
                                $clipboard.text = result
                            }
                        }]
                    })
                }
            })
        }
    }
})
