const isI2ConnectSeed = (sourceId) => {
	return sourceId.type === "OI.DAOD";
};

const regex = /-TENT\d/g;

module.exports = {
	valueFromCondition: (conditions, conditionId) => {
		const condition = conditions && conditions.find(x => x.id === conditionId);
		return condition && condition.value;
	},
	caseInsensitiveContains: (source, searchValue) => {
		return source.toLowerCase().includes(searchValue.toLowerCase());
	},
	extractExternalIdsFromI2ConnectSources: (sourceIds) => {
		const externalIds = sourceIds ? sourceIds.filter(isI2ConnectSeed).map(s => s.key[2]) : [];
		return new Set(externalIds);
	},
	cleanID: (ID) => {
		return ID.replace(regex, "");
	}
}