import { Router, Request, Response } from 'express';
import { McpService } from '../mcp/mcp.service';

const router = Router();
const mcpService = McpService.getInstance();

/**
 * Standard JSON-RPC 2.0 MCP Handler
 * POST /api/mcp
 */
router.post('/', async (req: Request, res: Response) => {
  const requestBody = req.body;
  if (!requestBody || typeof requestBody !== 'object') {
    return res.status(400).json({
      jsonrpc: '2.0',
      error: { code: -32700, message: 'Parse error: Invalid JSON payload' }
    });
  }

  const response = await mcpService.handleJsonRpc(requestBody);
  return res.json(response);
});

/**
 * MCP Server Information & Tool Discovery
 * GET /api/mcp
 */
router.get('/', (req: Request, res: Response) => {
  return res.json({
    status: 'online',
    server: mcpService.getServerInfo(),
    capabilities: {
      tools: mcpService.listTools(),
      resources: mcpService.listResources()
    },
    clientConfiguration: {
      mcpServers: {
        'medmatch-ai': {
          url: 'http://localhost:4000/api/mcp',
          transport: 'http'
        }
      }
    }
  });
});

/**
 * SSE Transport for MCP clients that support Server-Sent Events
 * GET /api/mcp/sse
 */
router.get('/sse', (req: Request, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });

  const endpointEvent = `event: endpoint\ndata: http://localhost:4000/api/mcp\n\n`;
  res.write(endpointEvent);

  req.on('close', () => {
    res.end();
  });
});

export default router;
