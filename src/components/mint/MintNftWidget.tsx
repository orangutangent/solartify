// 'use client'
// import { useState } from 'react'
// import { Spinner } from '@/components/ui/spinner'
// import { useNftGifterProgram } from '@/components/nftgifter/nftgifter-data-access'
// import { useUploadImage } from '../nftgifter/upload-image.hook'

// export function MintNftWidget() {
//   const [name, setName] = useState('')
//   const [desc, setDesc] = useState('')
//   const { mintNft } = useNftGifterProgram()

//   const uploadImage = useUploadImage()

//   const handleMint = async () => {
//     const imageUrl = await uploadImage.mutateAsync(image)
//     await mintNft.mutateAsync({ image: imageUrl, name, description: decs })
//   }

//   return (
//     <div className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-fuchsia-900/60 to-indigo-900/40 border border-zinc-700 shadow-lg max-w-xs mx-auto">
//       <div className="mb-2 text-lg font-semibold text-white">Mint NFT</div>
//       <input
//         type="text"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         className="w-full mb-2 px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none"
//         placeholder="NFT Name"
//         disabled={mintNft.isPending}
//       />
//       <input
//         type="text"
//         value={desc}
//         onChange={(e) => setDesc(e.target.value)}
//         className="w-full mb-3 px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none"
//         placeholder="Description (optional)"
//         disabled={mintNft.isPending}
//       />
//       <button
//         className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
//         onClick={handleMint}
//         disabled={mintNft.isPending || !name}
//       >
//         {mintNft.isPending ? <Spinner className="w-5 h-5" /> : 'Mint NFT'}
//       </button>
//       {mintNft.isSuccess && <div className="text-green-400 mt-2">NFT Minted!</div>}
//       {mintNft.isError && <div className="text-red-400 mt-2">Error. Try again.</div>}
//     </div>
//   )
// }
