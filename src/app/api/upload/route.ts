import { NextRequest, NextResponse } from 'next/server'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { createGenericFile, createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi'

export const runtime = 'nodejs'
// export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { image, name, description } = await req.json()
    if (!image || !name) {
      return NextResponse.json({ error: 'Image and name are required' }, { status: 400 })
    }

    console.log('Received upload request:', { name, description: description?.substring(0, 50) + '...' })

    const umi = createUmi(process.env.NEXT_PUBLIC_UMI_RPC!).use(irysUploader({ address: 'https://devnet.irys.xyz' }))

    // 1. Load the server wallet's secret key from .env.local
    const serverWalletSecretKey = process.env.SERVER_WALLET_SECRET_KEY
    if (!serverWalletSecretKey) {
      throw new Error('SERVER_WALLET_SECRET_KEY is not set in .env.local')
    }

    // 2. Create Keypair and Signer for Umi from the secret key
    const secretKeyUint8Array = new Uint8Array(JSON.parse(serverWalletSecretKey))
    const serverKeypair = umi.eddsa.createKeypairFromSecretKey(secretKeyUint8Array)
    const serverSigner = createSignerFromKeypair(umi, serverKeypair)
    umi.use(signerIdentity(serverSigner))

    // --- FOR DEVNET: Uncomment to airdrop SOL if the wallet is empty ---
    // const balance = await umi.rpc.getBalance(serverSigner.publicKey)
    // if (balance.basisPoints === 0n) {
    //   console.log(`Airdropping 1 SOL to ${serverSigner.publicKey}...`)
    //   await umi.rpc.airdrop(serverSigner.publicKey, sol(1)) // Airdrop 1 SOL
    // }
    // ---------------------------------------------------------------------

    // 3. Upload image
    console.log('Uploading image to Irys...')
    const base64Data = image.split(',')[1]
    const buffer = Buffer.from(base64Data, 'base64')
    const umiImageFile = createGenericFile(buffer, 'nft-image.jpg', {
      tags: [{ name: 'Content-Type', value: 'image/jpeg' }],
    })
    const [imageUri] = await umi.uploader.upload([umiImageFile])
    if (!imageUri) throw new Error('Image upload failed')
    console.log('Image uploaded, URI:', imageUri)

    // 4. Upload metadata
    console.log('Uploading metadata to Irys...')
    const metadata = {
      name,
      description: description || '',
      image: imageUri,
      properties: {
        files: [{ uri: imageUri, type: 'image/jpeg' }],
        category: 'image',
      },
    }
    const metadataUri = await umi.uploader.uploadJson(metadata)
    if (!metadataUri) throw new Error('Metadata upload failed')
    console.log('Metadata uploaded, URI:', metadataUri)

    return NextResponse.json({ metadataUri }, { status: 200 })
  } catch (e) {
    console.error('Upload error:', e)
    const errorMessage = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
