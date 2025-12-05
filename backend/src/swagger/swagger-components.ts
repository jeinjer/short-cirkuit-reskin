/**
 * @openapi
 * components:
 *   schemas:
 *     ProductSpecs:
 *       type: object
 *       properties:
 *         ram:
 *           type: string
 *         cpu:
 *           type: string
 *         storage:
 *           type: string
 *         panelType:
 *           type: string
 *         refreshRate:
 *           type: string
 *         screenSize:
 *           type: string
 *         printType:
 *           type: string
 *
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         sku:
 *           type: string
 *         name:
 *           type: string
 *         brand:
 *           type: string
 *         category:
 *           type: string
 *         priceUsd:
 *           type: number
 *         specs:
 *           $ref: '#/components/schemas/ProductSpecs'
 *
 *     ProductsResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         meta:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *             page:
 *               type: integer
 *             last_page:
 *               type: integer
 *
 *     FilterSpecs:
 *       type: object
 *       properties:
 *         ram:
 *           type: array
 *           items:
 *             type: string
 *         storage:
 *           type: array
 *           items:
 *             type: string
 *         cpu:
 *           type: array
 *           items:
 *             type: string
 *         panel:
 *           type: array
 *           items:
 *             type: string
 *         hz:
 *           type: array
 *           items:
 *             type: string
 *         screen:
 *           type: array
 *           items:
 *             type: string
 *         print_type:
 *           type: array
 *           items:
 *             type: string
 *
 *     FiltersResponse:
 *       type: object
 *       properties:
 *         brands:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               count:
 *                 type: integer
 *         minPrice:
 *           type: number
 *         maxPrice:
 *           type: number
 *         specs:
 *           $ref: '#/components/schemas/FilterSpecs'
 *
 *     CategoryCount:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         count:
 *           type: integer
 *
 *     DolarResponse:
 *       type: object
 *       properties:
 *         rate:
 *           type: number
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */

export {};
