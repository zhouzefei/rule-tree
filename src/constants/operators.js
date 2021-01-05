const baseOperator = [
	{
		name: "==",
		dName: "等于",
		enDName: "equal"
	},
	{
		name: "!=",
		dName: "不等于",
		enDName: "unequal"
	},
	{
		name: "isnull",
		dName: "为空",
		enDName: "isnull"
	},
	{
		name: "notnull",
		dName: "不为空",
		enDName: "notnull"
	},
	{
		name: "include",
		dName: "包含",
		enDName: "include"
	},
	{
		name: "exclude",
		dName: "不包含",
		enDName: "exclude"
	}
];
const otherOperator = [
	{
		name: "prefix",
		dName: "前缀",
		enDName: "prefix"
	},
	{
		name: "suffix",
		dName: "后缀",
		enDName: "suffix"
	}
];
const numOperator = [
	{
		name: "<=",
		dName: "小于等于",
		enDName: "equal or less than"
	},
	{
		name: "<",
		dName: "小于",
		enDName: "less than"
	},
	{
		name: ">",
		dName: "大于",
		enDName: "greater than"
	},
	{
		name: ">=",
		dName: "大于等于",
		enDName: "equal or greater than"
	}
];

export default (type) => {
	if (["STRING"].indexOf(type) > -1) {
		return [
			...otherOperator,
			...baseOperator
		];
	} else if (["DOUBLE", "INT", "LONG"].indexOf(type) > -1) {
		return [
			...numOperator,
			...baseOperator
		];
	} else {
		return baseOperator;
	}
};
