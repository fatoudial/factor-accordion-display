
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Criteria {
  id?: string;
  code: string;
  name: string;
  // Ajoutez d'autres propriétés selon vos besoins
}

interface SubFactor {
  id: string;
  factorName: string;
  criterias?: Criteria[];
}

interface Factor {
  id: string;
  factorName: string;
  subFactors?: SubFactor[];
  criterias?: Criteria[];
}

interface FactorsListProps {
  factor: Factor;
  renderCriteriaField: (criteria: Criteria) => React.ReactNode;
}

const FactorsList: React.FC<FactorsListProps> = ({ factor, renderCriteriaField }) => {
  return (
    <CardContent className="p-4">
      {/* Accordions des sous-facteurs */}
      {factor.subFactors && factor.subFactors.map((subFactor) => (
        <Accordion key={subFactor.id} type="single" collapsible className="mb-2">
          <AccordionItem value={subFactor.id} className="border border-gray-200 rounded-lg">
            <AccordionTrigger className="bg-gray-100 px-4 py-3 font-semibold text-primary border-b border-gray-200 hover:no-underline">
              {subFactor.factorName}
            </AccordionTrigger>
            <AccordionContent className="p-4">
              {subFactor.criterias && subFactor.criterias.length === 1 ? (
                <div className="max-w-2xl mx-auto">
                  {subFactor.criterias.map((criteria) => (
                    <div key={criteria.code}>
                      {renderCriteriaField(criteria)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subFactor.criterias && subFactor.criterias.map((criteria) => (
                    <div key={criteria.code}>
                      {renderCriteriaField(criteria)}
                    </div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}

      {/* Critères directs du facteur */}
      {factor.criterias && (
        <Card className="bg-gray-50 border border-gray-200 mt-6">
          <CardContent className="p-6">
            {factor.criterias.length === 1 ? (
              <div className="max-w-2xl mx-auto">
                {factor.criterias.map((criteria) => (
                  <div key={criteria.id || criteria.code}>
                    {renderCriteriaField(criteria)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {factor.criterias.map((criteria) => (
                  <div key={criteria.id || criteria.code}>
                    {renderCriteriaField(criteria)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </CardContent>
  );
};

export default FactorsList;
