export const WARNED_COMPTROLLERS = [
  "0x07cd53380fe9b2a5e64099591b498c73f0efaa66",
  "0x35de88f04ad31a396aedb33f19aebe7787c02560",
  "0x3f2d1bc6d02522dbcdb216b2e75edddafe04b16f",
  "0x621579dd26774022f33147d3852ef4e00024b763",
  "0x88f7c23ea6c4c404da463bc9ae03b012b32def9e",
  "0xc54172e34046c1653d1920d40333dd358c7a1af4",
  "0xc7125e3a2925877c7371d579d29dae4729ac9033",
];

export const isWarnedComptroller = (addr: string | undefined): boolean => {
  if (!addr) return false;
  return WARNED_COMPTROLLERS.map((c) => c.toLowerCase()).includes(
    addr.toLowerCase()
  );
};
