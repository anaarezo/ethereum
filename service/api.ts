import { useMutation } from "@tanstack/react-query";

const requestAPI = useMutation({
  //   mutationFn: () => Promise.resolve('success'),
  //   onSettled: () => {
  //     results.push('onSettled-promise')
  //     return Promise.resolve('also-ignored') // Promise<string> (should be ignored)
  //   },
  //   onMutate: async () => {
  //     results.push('onMutate-async')
  //     await sleep(1)
  //     return { backup: 'async-data' }
  //   },
  //   onError: async () => {
  //     results.push('onError-async-start')
  //     await sleep(1)
  //     results.push('onError-async-end')
  //   },
});
