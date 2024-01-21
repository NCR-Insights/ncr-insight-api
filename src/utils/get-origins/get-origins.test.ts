import { getOrigins } from "./get-origins";

const GET_ORIGINS_TEST_CASES = [
	{
		origin: "http://localhost:8000, http://localhost:3000",
		result: ["http://localhost:8000", "http://localhost:3000"],
	},
	{
		origin: "https://google.com, https://facebook.com         ",
		result: ["https://google.com", "https://facebook.com"],
	},
];

test("Get Origins Test", () => {
	GET_ORIGINS_TEST_CASES.map((test) =>
		expect(getOrigins(test.origin)).toStrictEqual(test.result),
	);
});
