import type { AnchorIdl } from '@codama/nodes-from-anchor'
import { rootNodeFromAnchorWithoutDefaultVisitor } from '@codama/nodes-from-anchor'
import { renderJavaScriptUmiVisitor, renderJavaScriptVisitor, renderRustVisitor } from '@codama/renderers'
import { visit } from '@codama/visitors-core'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const idlPath = path.resolve(__dirname, '../../target/idl/nft_gifter.json')
const anchorIdl = JSON.parse(fs.readFileSync(idlPath, 'utf-8'))

async function generateClients() {
  const node = rootNodeFromAnchorWithoutDefaultVisitor(anchorIdl as AnchorIdl)

  const clients = [
    { type: 'JS', dir: 'clients/generated/js/src', renderVisitor: renderJavaScriptVisitor },
    { type: 'Umi', dir: 'clients/generated/umi/src', renderVisitor: renderJavaScriptUmiVisitor },
    { type: 'Rust', dir: 'clients/generated/rust/src', renderVisitor: renderRustVisitor },
  ]

  for (const client of clients) {
    try {
      await visit(node, await client.renderVisitor(client.dir))
      console.log(`✅ Successfully generated ${client.type} client for directory: ${client.dir}!`)
    } catch (e) {
      console.error(`Error in ${client.renderVisitor.name}:`, e)
      throw e
    }
  }
}

generateClients()
