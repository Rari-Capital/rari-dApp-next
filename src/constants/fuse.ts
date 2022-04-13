export const WARNED_COMPTROLLERS = [
  "0xa58056e9dcc7bf3006dbb695a4cd70a11553b9bf",
  "0xf53c73332459b0dbd14d8e073319e585f7a46434",
  "0xAbDFCdb1503d89D9a6fFE052a526d7A41f5b76D6",
  "0xa58056E9DcC7Bf3006DBb695a4cD70A11553b9bF"
];

export const isWarnedComptroller = (addr: string) => {
  return WARNED_COMPTROLLERS.includes(addr);
};
