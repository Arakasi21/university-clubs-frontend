export function decimalToRgb(decimal: number) {
	const red = (decimal >> 16) & 0xff
	const green = (decimal >> 8) & 0xff
	const blue = decimal & 0xff
	return `rgb(${red}, ${green}, ${blue})`
}
