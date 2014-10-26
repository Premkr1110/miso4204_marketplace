/* ========================================================================
 * Copyright 2014 miso4204
 *
 * Licensed under the MIT, The MIT License (MIT)
 * Copyright (c) 2014 miso4204

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 * ========================================================================


Source generated by CrudMaker version 1.0.0.qualifier

*/

package co.edu.uniandes.csw.miso4204.buyer.master.logic.mock;
import java.util.ArrayList;
import java.util.List;

import co.edu.uniandes.csw.miso4204.buyer.logic.dto.BuyerDTO;
import co.edu.uniandes.csw.miso4204.buyer.logic.api.IBuyerLogicService;
import co.edu.uniandes.csw.miso4204.buyer.master.logic.api._IBuyerMasterLogicService;
import co.edu.uniandes.csw.miso4204.buyer.master.logic.dto.BuyerMasterDTO;
import co.edu.uniandes.csw.miso4204.creditcard.logic.api.ICreditCardLogicService;
import co.edu.uniandes.csw.miso4204.address.logic.api.IAddressLogicService;
import co.edu.uniandes.csw.miso4204.creditcard.logic.dto.CreditCardDTO;
import co.edu.uniandes.csw.miso4204.address.logic.dto.AddressDTO;
import javax.inject.Inject;
import javax.ejb.EJB;


public abstract class _BuyerMasterMockLogicService implements _IBuyerMasterLogicService {

    protected static ArrayList<BuyerMasterDTO> buyerMasterDtosList = new ArrayList<BuyerMasterDTO>() ;
    @Inject
    protected ICreditCardLogicService creditCardPersistance;
    @Inject
    protected IAddressLogicService addressPersistance;
    @Inject
    protected IBuyerLogicService buyerPersistance;

    public BuyerMasterDTO createMasterBuyer(BuyerMasterDTO buyer) {

        buyerPersistance.createBuyer(buyer.getBuyerEntity());
        for (CreditCardDTO dto : buyer.getCreatecreditCard()) {
            buyer.getListcreditCard().add(creditCardPersistance.createCreditCard(dto));
        }
        for (AddressDTO dto : buyer.getCreateaddress()) {
            buyer.getListaddress().add(addressPersistance.createAddress(dto));
        }
        buyerMasterDtosList.add(buyer);
        return buyer;
    }

    public BuyerMasterDTO getMasterBuyer(Long id) {
        for (BuyerMasterDTO buyerMasterDTO : buyerMasterDtosList) {
            if (buyerMasterDTO.getBuyerEntity().getId() == id) {
                return buyerMasterDTO;
            }
        }

        return null;
    }

    public void deleteMasterBuyer(Long id) {
        for (BuyerMasterDTO buyerMasterDTO : buyerMasterDtosList) {
            if (buyerMasterDTO.getBuyerEntity().getId() == id) {

                for (CreditCardDTO dto : buyerMasterDTO.getCreatecreditCard()) {
                    creditCardPersistance.deleteCreditCard(dto.getId());
                }
                buyerPersistance.deleteBuyer(buyerMasterDTO.getId());
                buyerMasterDtosList.remove(buyerMasterDTO);
                for (AddressDTO dto : buyerMasterDTO.getCreateaddress()) {
                    addressPersistance.deleteAddress(dto.getId());
                }
                buyerPersistance.deleteBuyer(buyerMasterDTO.getId());
                buyerMasterDtosList.remove(buyerMasterDTO);
            }
        }

    }

    public void updateMasterBuyer(BuyerMasterDTO buyer) {

		BuyerMasterDTO currentBuyer = getMasterBuyer(buyer.getBuyerEntity().getId());
		if (currentBuyer == null) {
			currentBuyer = buyer;
		}else{
			buyerMasterDtosList.remove(currentBuyer);
		}

        // update CreditCard
        if (buyer.getUpdatecreditCard() != null) {
            for (CreditCardDTO dto : buyer.getUpdatecreditCard()) {
                creditCardPersistance.updateCreditCard(dto);
                for (CreditCardDTO creditCarddto : currentBuyer.getListcreditCard()) {
					if (creditCarddto.getId() == dto.getId()) {
						currentBuyer.getListcreditCard().remove(creditCarddto);
						currentBuyer.getListcreditCard().add(dto);
					}
				}
            }
        }
        // persist new CreditCard
        if (buyer.getCreatecreditCard() != null) {
            for (CreditCardDTO dto : buyer.getCreatecreditCard()) {
                CreditCardDTO persistedCreditCardDTO = creditCardPersistance.createCreditCard(dto);
                dto = persistedCreditCardDTO;
                currentBuyer.getListcreditCard().add(dto);
            }
        }
        // delete CreditCard
        if (buyer.getDeletecreditCard() != null) {
            for (CreditCardDTO dto : buyer.getDeletecreditCard()) {
				for (CreditCardDTO creditCarddto : currentBuyer.getListcreditCard()) {
					if (creditCarddto.getId() == dto.getId()) {
						currentBuyer.getListcreditCard().remove(creditCarddto);
					}
				}
                creditCardPersistance.deleteCreditCard(dto.getId());
            }
        }
        // update Address
        if (buyer.getUpdateaddress() != null) {
            for (AddressDTO dto : buyer.getUpdateaddress()) {
                addressPersistance.updateAddress(dto);
                for (AddressDTO addressdto : currentBuyer.getListaddress()) {
					if (addressdto.getId() == dto.getId()) {
						currentBuyer.getListaddress().remove(addressdto);
						currentBuyer.getListaddress().add(dto);
					}
				}
            }
        }
        // persist new Address
        if (buyer.getCreateaddress() != null) {
            for (AddressDTO dto : buyer.getCreateaddress()) {
                AddressDTO persistedAddressDTO = addressPersistance.createAddress(dto);
                dto = persistedAddressDTO;
                currentBuyer.getListaddress().add(dto);
            }
        }
        // delete Address
        if (buyer.getDeleteaddress() != null) {
            for (AddressDTO dto : buyer.getDeleteaddress()) {
				for (AddressDTO addressdto : currentBuyer.getListaddress()) {
					if (addressdto.getId() == dto.getId()) {
						currentBuyer.getListaddress().remove(addressdto);
					}
				}
                addressPersistance.deleteAddress(dto.getId());
            }
        }
        buyerMasterDtosList.add(currentBuyer);
    }
}