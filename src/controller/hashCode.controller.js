import { hashCodeService } from '@/services';

export const getHashCodes = async (req, res) => {
  try {
    const result = await hashCodeService.getHashCodes();
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

// export const saveHashCode = async (req, res) => {
//   try {
//     const { input } = req.body;
//     const result = await hashCodeService.saveEmailTemplate(input);
//     res.status(200).json(result);
//   } catch (e) {
//     res.status(500).json(e.message);
//   }
// };
