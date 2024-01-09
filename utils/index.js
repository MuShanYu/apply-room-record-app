export function dateShow(dateTime, format = 'yyyy-MM-dd hh:mm:ss') {
	let threshold = [0, 0] // 阈值
	// let threshold = [60000, 6000000] // 阈值
	const text = {
		year: '年',
		month: '月',
		day: '天',
		hour: '小时',
		minute: '分钟',
		second: '秒',
		ago: '前',
		later: '后',
		justNow: '刚刚',
		soon: '马上',
		template: '{num}{unit}{suffix}'
	}
	let date = getDate(dateTime)
	let ms = date.getTime() - Date.now()
	let absMs = Math.abs(ms)
	if (absMs < threshold[0]) {
		return ms < 0 ? text.justNow : text.soon
	}
	if (absMs >= threshold[1]) {
		return formatDate(date, format)
	}
	let num
	let unit
	let suffix = text.later
	if (ms < 0) {
		suffix = text.ago
		ms = -ms
	}
	const seconds = Math.floor((ms) / 1000)
	const minutes = Math.floor(seconds / 60)
	const hours = Math.floor(minutes / 60)
	const days = Math.floor(hours / 24)
	const months = Math.floor(days / 30)
	const years = Math.floor(months / 12)
	switch (true) {
		case years > 0:
			num = years
			unit = text.year
			break
		case months > 0:
			num = months
			unit = text.month
			break
		case days > 0:
			num = days
			unit = text.day
			break
		case hours > 0:
			num = hours
			unit = text.hour
			break
		case minutes > 0:
			num = minutes
			unit = text.minute
			break
		default:
			num = seconds
			unit = text.second
			break
	}

	return text.template.replace(/{\s*num\s*}/g, num + '').replace(/{\s*unit\s*}/g, unit).replace(
		/{\s*suffix\s*}/g,
		suffix)
}

function formatDate(date, format) {
	if (!date && date !== 0) {
		return ''
	}
	date = getDate(date)
	const dateObj = {
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		day: date.getDate(),
		hour: date.getHours(),
		minute: date.getMinutes(),
		second: date.getSeconds(),
		millisecond: date.getMilliseconds()
	}
	const tokenRegExp = /yyyy|yy|MM|M|dd|d|hh|h|mm|m|ss|s/
	let flag = true
	let result = format
	while (flag) {
		flag = false
		result = result.replace(tokenRegExp, (matched) => {
			flag = true
			return parser(matched, dateObj)
		})
	}
	return result
}
// iOS不认识2020-12-12，需要转换为2020/12/12
function getDate(time) {
	if (time instanceof Date) {
		return time
	}
	switch (typeof time) {
		case 'string': {
			// 2020-12-12T12:12:12.000Z、2020-12-12T12:12:12.000
			if (time.indexOf('T') > -1) {
				return new Date(time)
			}
			return new Date(time.replace(/-/g, '/'))
		}
		default:
			return new Date(time)
	}
}

function parser(matched, dateObj) {
	switch (matched) {
		case 'yyyy':
			return pad(dateObj.year, 4)
		case 'yy':
			return pad(dateObj.year)
		case 'MM':
			return pad(dateObj.month)
		case 'M':
			return dateObj.month
		case 'dd':
			return pad(dateObj.day)
		case 'd':
			return dateObj.day
		case 'hh':
			return pad(dateObj.hour)
		case 'h':
			return dateObj.hour
		case 'mm':
			return pad(dateObj.minute)
		case 'm':
			return dateObj.minute
		case 'ss':
			return pad(dateObj.second)
		case 's':
			return dateObj.second
		default:
			break
	}
}

function pad(str, length = 2) {
	str += ''
	while (str.length < length) {
		str = '0' + str
	}
	return str.slice(-length)
}

export function getTime(dateOption) {
	let today = new Date()
	// 设置时间为 00:00:00
	today.setHours(0, 0, 0, 0);
	switch (dateOption) {
		case 'today':
			// 获取今天 00:00:00 的时间戳
			let todayStartTimestamp = today.getTime();
			// 获取今天 23:59:59 的时间戳
			let todayEndTimestamp = todayStartTimestamp + 24 * 60 * 60 * 1000 - 1;
			return [todayStartTimestamp, todayEndTimestamp]
		case 'tomorrow':
			let tomorrow = new Date(today);
			tomorrow.setDate(today.getDate() + 1);
			// 获取明天 00:00:00 的时间戳
			let tomorrowStartTimestamp = tomorrow.getTime();
			// 获取明天 23:59:59 的时间戳
			let tomorrowEndTimestamp = tomorrowStartTimestamp + 24 * 60 * 60 * 1000 - 1;
			return [tomorrowStartTimestamp, tomorrowEndTimestamp]
		case 'afterTomorrow':
			// 获取后天的日期对象
			let dayAfterTomorrow = new Date(today);
			dayAfterTomorrow.setDate(today.getDate() + 2);
			// 获取后天 00:00:00 的时间戳
			let dayAfterTomorrowStartTimestamp = dayAfterTomorrow.getTime();
			// 获取后天 23:59:59 的时间戳
			let dayAfterTomorrowEndTimestamp = dayAfterTomorrowStartTimestamp + 24 * 60 * 60 * 1000 - 1;
			return [dayAfterTomorrowStartTimestamp, dayAfterTomorrowEndTimestamp]
		default:
			return [null, null]
	}
}