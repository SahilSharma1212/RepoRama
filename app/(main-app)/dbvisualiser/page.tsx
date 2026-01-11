import React from 'react'
import { mongooseCode } from '@/app/dbParsers/mongodb/hardCoded'
import { parseMongooseSchema } from '@/app/dbParsers/mongodb/parser'


export default function page() {

    const entities = parseMongooseSchema(mongooseCode);
    return (
        <div>

            
            <h1 className="text-2xl text-white text-center">Parsed MongoDB Schemas</h1>
            {entities.map(entity => (
                <div key={entity.name} className='border border-white p-4 rounded-lg flex flex-col gap-4'>
                    <h2 className='border-b border-b-gray-500 text-white'>{entity.name}</h2>
                    <h3 className='border-b border-b-gray-500 text-white'>Fields:</h3>
                    <ul>
                        {entity.fields.map(f => (
                            <li key={f.name} className='border-b border-b-gray-500 text-white'>{f.name}: {f.type}</li>
                        ))}
                    </ul>
                    <h3  className='border-b border-b-gray-500 text-white'>Relationships:</h3>
                    <ul>
                        {entity.relationships.map(r => (
                            <li key={r.field}  className='border-b border-b-gray-500 text-white'>{r.field} → {r.to} ({r.cardinality})</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}
